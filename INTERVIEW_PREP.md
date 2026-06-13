# Full Stack Developer Interview Preparation Guide

## 1. PROJECT ARCHITECTURE & WORKFLOW

### Q1: Walk me through the overall architecture of your project. What does the data flow look like from the frontend to the backend?

**Model Answer:**
"In DigitalDokanFrontEnd, we follow a modern Next.js 16 architecture with the App Router. The workflow is:

1. **Frontend Layer**: React components on Next.js handle the UI. User interactions trigger Server Actions or API calls.
2. **API Layer**: Next.js Route Handlers (`/app/api`) serve as the middleware, handling business logic, validation, and authentication.
3. **Database Layer**: We connect to [your database choice] through an ORM/query builder.
4. **Data Flow**: User Action → Component State → Server Action/API Route → Database Query → Response → UI Update

For example, when a user creates a product:
- User fills form in React component
- Client-side validation happens first
- Form submission calls a Server Action with form data
- Server Action authenticates user, validates input, inserts into DB
- Returns success/error response
- Component updates UI based on response
- Re-renders with new data using SWR for cache invalidation"

---

### Q2: Why did you choose Next.js with App Router? What are the advantages over traditional client-side frameworks?

**Model Answer:**
"Next.js 16 with App Router provides several advantages:

1. **Server Components by Default**: Reduces JavaScript sent to browsers, improves performance and security.
2. **Built-in Routing**: File-based routing is intuitive and scalable (`/app/dashboard/page.tsx` → `/dashboard`).
3. **Server Actions**: Direct backend logic in components without separate API routes for simple operations.
4. **Image Optimization**: Automatic image optimization with `next/image`.
5. **Edge Functions**: Deploy API routes globally with zero cold starts.
6. **Built-in Authentication**: Integrates well with Better Auth, Supabase Auth, or Auth.js.
7. **SEO**: Server-side rendering improves SEO, built-in metadata API.

This is better than pure client-side because:
- Sensitive operations stay on the server
- No exposing API keys to frontend
- Database queries are co-located with logic
- Faster initial load time due to SSR/SSG"

---

## 2. CORE TECHNICAL CONCEPTS

### Q3: How do you handle authentication in your full stack app? Walk me through the flow.

**Model Answer:**
"We implement authentication using [Better Auth / Supabase Auth / Auth.js]. Here's the flow:

1. **Login**: User submits credentials → Server Action validates against DB → Creates secure session cookie → Returns session to client
2. **Session Management**: Session cookie stored in httpOnly cookie (secure, not accessible via JavaScript)
3. **Protected Routes**: Middleware intercepts requests, checks session validity
4. **API Protection**: Server Actions and API routes verify user identity before processing
5. **Logout**: Clear session cookie and destroy session in DB

**Security Best Practices**:
- Passwords hashed with bcrypt (not stored in plain text)
- Sessions expire after 24 hours
- Refresh tokens for extending valid sessions
- CSRF protection through cookie SameSite attribute
- Row-level security on database queries

Example: When user accesses `/dashboard`, middleware checks if valid session exists. If not, redirects to `/login`."

---

### Q4: How do you structure your database? What's your schema design philosophy?

**Model Answer:**
"We follow normalization principles with consideration for query patterns:

1. **User Management**:
   - `users` table: id, email, password_hash, created_at
   - `sessions` table: id, user_id, token, expires_at

2. **Application Entities** (example for ecommerce):
   - `products` table: id, name, price, description, user_id (creator), created_at
   - `orders` table: id, user_id, total_amount, status, created_at
   - `order_items` table: id, order_id, product_id, quantity, price

3. **Design Decisions**:
   - Foreign keys with cascade deletes for data integrity
   - Indexes on frequently queried columns (user_id, created_at)
   - Soft deletes for audit trails (added_at, deleted_at)
   - Timestamps (created_at, updated_at) on all tables

4. **Relationships**:
   - One-to-Many: User → Products
   - Many-to-Many: Products → Orders (through order_items)

5. **Performance**:
   - Denormalize when necessary (store product_name in order_items for quick access)
   - Proper indexing prevents N+1 queries
   - Used query optimization tools to identify slow queries"

---

## 3. STATE MANAGEMENT & DATA FETCHING

### Q5: How do you manage data fetching and caching? Why did you choose your approach?

**Model Answer:**
"We use **SWR (stale-while-revalidate)** for client-side state and data fetching:

```typescript
// Hook for fetching products
const { data: products, error, isLoading } = useSWR('/api/products', fetcher);
```

**Why SWR over alternatives**:
1. **Automatic caching**: Data is cached and reused across components
2. **Revalidation**: Stale data is revalidated in background
3. **Optimistic updates**: UI updates immediately, syncs with server later
4. **Focus refetch**: When user returns to tab, data refreshes automatically
5. **Minimal boilerplate**: No Redux or Context complexity for this use case

**For sensitive/complex state** (like form state), we use:
- React hooks (useState) for form-level state
- Server Actions for mutations to avoid exposing database logic
- useTransition for optimistic updates during Server Actions

**Invalidation Strategy**:
- After creating/updating data, we call `mutate()` to revalidate
- Or use Next.js `revalidateTag()` from Server Actions
- Prevents stale data issues"

---

### Q6: How do you prevent N+1 query problems?

**Model Answer:**
"N+1 queries happen when you loop over records and fetch related data individually. 

**Problem Example**:
```javascript
// BAD - N+1 problem
const users = await db.user.findAll(); // 1 query
users.forEach(user => {
  user.orders = await db.order.findByUserId(user.id); // N queries
});
// Total: 1 + N queries
```

**Solutions**:
1. **JOIN queries**: Fetch related data in single query
```sql
SELECT u.*, o.* FROM users u 
LEFT JOIN orders o ON u.id = o.user_id;
```

2. **Batch loading**: Fetch all IDs first, then all related records
```javascript
const userIds = users.map(u => u.id);
const allOrders = await db.order.findByUserIds(userIds);
```

3. **ORMs with eager loading** (Drizzle, Prisma):
```typescript
const users = await db.query.users.findMany({
  with: { orders: true } // Eagerly load orders
});
```

**Prevention**:
- Use query analysis tools to identify N+1 issues
- Profile database queries in development
- Write integration tests that verify query count
- Use database query logs to detect suspicious patterns"

---

## 4. REAL-WORLD PROBLEMS & DEBUGGING

### Q7: Tell me about a complex bug you faced. How did you debug and solve it?

**Model Answer:**
"**Problem**: Users reported that after creating an order, the order sometimes wouldn't appear in their order list, but they were charged.

**Initial Investigation**:
- Checked browser console - no JavaScript errors
- Verified database - orders were actually being created
- Issue was intermittent, happened to ~5% of users

**Debugging Process**:
1. Added logging to Server Action and API routes
2. Checked network timing - order creation was fast (~100ms)
3. Realized issue: After order creation, we revalidated cache, but the component was still showing stale SWR data
4. The problem: Revalidation took time, but component didn't wait

**Root Cause**: Race condition between:
- Database write completes
- Cache revalidation starts
- User's component SWR cache hasn't updated yet

**Solution Implemented**:
1. Used `mutate()` in component after order creation to immediately update SWR cache
2. Added `revalidateTag('orders')` in Server Action to invalidate backend cache
3. Added UI loading state during checkout to prevent navigation before data syncs
4. Implemented optimistic updates - show order immediately, sync with server

```typescript
// Before: No local update
const response = await createOrder(formData);

// After: Optimistic update + revalidation
const response = await createOrder(formData);
mutate('/api/orders'); // Immediately refetch orders
```

**Prevention for Future**:
- Added monitoring/logging to catch order creation delays
- Wrote tests simulating slow network conditions
- Implemented timeout handling for critical operations"

---

### Q8: How do you handle errors and edge cases in production?

**Model Answer:**
"**Error Handling Strategy**:

1. **API/Server Action Errors**:
```typescript
export async function createProduct(formData) {
  try {
    // Validate input
    const validated = productSchema.parse(formData);
    
    // Check authorization
    const user = await getSession();
    if (!user) throw new Error('Unauthorized');
    
    // Database operation
    const product = await db.products.create(validated);
    
    // Revalidate cache
    revalidateTag('products');
    
    return { success: true, data: product };
  } catch (error) {
    // Log to monitoring service
    logger.error('Product creation failed', { error, userId: user?.id });
    
    // Return user-friendly error
    if (error instanceof ValidationError) {
      return { success: false, error: 'Invalid product data' };
    }
    return { success: false, error: 'Something went wrong' };
  }
}
```

2. **Client-side Error Handling**:
- Try-catch on Server Actions
- Display user-friendly error messages
- Retry logic for transient failures
- Fallback UI for loading/error states

3. **Database Errors**:
- Constraint violations → User-friendly message
- Connection timeouts → Retry with exponential backoff
- Transaction rollback on partial failure

4. **Monitoring & Alerting**:
- Send errors to Sentry/monitoring service
- Alert on high error rates
- Track failed transactions for audit

5. **Common Edge Cases**:
- Concurrent updates to same record → Optimistic locking
- Missing related records → 404 not deleted state
- Timeout on slow queries → Return cached data
- User deleted while processing → Graceful failure"

---

## 5. PERFORMANCE OPTIMIZATION

### Q9: How do you optimize your application's performance? Give specific examples.

**Model Answer:**
"**Frontend Performance**:

1. **Code Splitting**: Next.js automatically splits code by route
2. **Image Optimization**: Use `next/image` with automatic resizing and lazy loading
3. **Component Memoization**: Memo frequently re-rendering components
4. **Lazy Loading**: Dynamic imports for heavy components
5. **Bundle Analysis**: Used `next-bundle-analyzer` to identify large dependencies

**Backend Performance**:

1. **Database Indexing**:
   - Index frequently queried columns (user_id, email)
   - Composite indexes for multi-column filters
   - Regular index maintenance

2. **Query Optimization**:
   - Avoid SELECT * → specify needed columns
   - Use LIMIT for pagination
   - Implement pagination instead of fetching all records

3. **Caching Strategy**:
   - Redis for frequently accessed data (product catalog)
   - SWR for client-side data caching
   - HTTP cache headers for static assets

4. **API Response Optimization**:
   - Pagination (return 20 items per page, not 10,000)
   - Field filtering (allow clients to request only needed fields)
   - Compression (gzip enabled)

**Real Example - Product List Optimization**:
- **Before**: Fetching 10,000 products took 5 seconds, page lag
- **After**: 
  - Pagination (20 per page) → 500ms
  - Database index on category → 100ms improvement
  - SWR caching → No refetch on re-mount
  - Image optimization → 40% smaller images
  - Final result: 200ms load time, 95 Lighthouse score

**Monitoring**:
- Used Next.js analytics to track Web Vitals (LCP, FID, CLS)
- Database query profiling to find slow queries
- Set performance budgets and alerts"

---

### Q10: How do you handle pagination and filtering at scale?

**Model Answer:**
"**Pagination Implementation**:

```typescript
// API Route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  
  const skip = (page - 1) * limit;
  
  const [products, total] = await Promise.all([
    db.products.findMany({ skip, take: limit }),
    db.products.count()
  ]);
  
  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

**Filtering Strategy**:

1. **Index-Based Filtering**: Ensure filters use indexed columns
2. **Query Building**: Dynamically build queries based on applied filters

```typescript
let query = db.products.query;

if (category) query = query.where('category', '=', category);
if (minPrice) query = query.where('price', '>=', minPrice);
if (maxPrice) query = query.where('price', '<=', maxPrice);
if (search) query = query.where('name', 'ILIKE', `%${search}%`);

const results = await query.limit(limit).offset(skip);
```

3. **Search Optimization**: Use full-text search for better performance than LIKE
```sql
SELECT * FROM products WHERE name @@ to_tsquery('english', 'laptop')
```

4. **Caching**: Cache common filter combinations
   - Product by category → Cache for 1 hour
   - Search results → Cache for 15 minutes

**Frontend**:
- Debounce search input (wait 300ms after user stops typing)
- Lazy-load more results on scroll instead of pagination buttons
- Store pagination state in URL for shareable filters

**Edge Cases**:
- User requests page 1000 with 10M records → Still O(1) with OFFSET/LIMIT
- Filter that matches no results → Return empty array gracefully
- Concurrent filters → Use query builder to combine conditions"

---

## 6. SECURITY & BEST PRACTICES

### Q11: What security measures do you implement in your application?

**Model Answer:**
"**Authentication Security**:
- Passwords hashed with bcrypt (salt rounds: 10)
- httpOnly, Secure cookies (not accessible via JavaScript)
- Session expiration (24 hours)
- CSRF tokens on form submissions

**Authorization**:
- Row-level security checks (users can only access their own data)
- Role-based access control (Admin, User, Guest)
- Check user ownership before modifying resources

```typescript
const product = await db.products.findFirst({
  where: { id: productId, userId: user.id } // Verify ownership
});
```

**Data Protection**:
- Encrypt sensitive data at rest (payment info, PII)
- HTTPS enforced in production
- No sensitive data in logs or error messages
- Sanitize user input to prevent XSS
- Parameterized queries to prevent SQL injection

```typescript
// BAD - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD - Parameterized
const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
```

**Rate Limiting**:
- Limit login attempts (5 attempts per 15 minutes)
- API rate limiting (100 requests per minute per user)
- Prevent brute force attacks

**Secrets Management**:
- Environment variables for API keys
- Never commit secrets to git
- Use .env.local for development, Vercel Secrets for production

**Validation**:
- Server-side validation of all inputs
- Client-side validation for UX (not security)
- Validate file uploads (type, size, content)

**Content Security Policy**:
- CSP headers to prevent XSS
- Only allow scripts from trusted sources"

---

### Q12: How do you handle file uploads securely?

**Model Answer:**
"**File Upload Strategy**:

1. **Client-side Validation**:
```typescript
const file = event.target.files[0];
if (file.size > 5 * 1024 * 1024) return; // Max 5MB
if (!['image/jpeg', 'image/png'].includes(file.type)) return;
```

2. **Server-side Validation** (critical):
```typescript
export async function uploadProfileImage(formData: FormData) {
  const file = formData.get('file') as File;
  
  // Check size
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large');
  }
  
  // Check MIME type (read file magic bytes, not just extension)
  const buffer = await file.arrayBuffer();
  const headerBytes = new Uint8Array(buffer).slice(0, 4);
  const isValidImage = isValidImageType(headerBytes);
  if (!isValidImage) {
    throw new Error('Invalid file type');
  }
  
  // Store in Vercel Blob (not in repo)
  const blob = await put(`profiles/${user.id}/${file.name}`, file);
  
  // Update database with URL
  await db.users.update(user.id, { imageUrl: blob.url });
}
```

3. **Storage**:
- Use Vercel Blob or S3 (cloud storage)
- Never store in `/public` directory (fills up server)
- Generate unique filenames to prevent conflicts
- Store metadata in database (original name, size, upload date)

4. **Security**:
- Scan files for malware
- Serve with `Content-Disposition: attachment` to prevent execution
- Implement virus scanning for critical applications
- Check file content, not just extension"

---

## 7. TESTING & CODE QUALITY

### Q13: How do you test your application? What's your testing strategy?

**Model Answer:**
"**Testing Pyramid**:

1. **Unit Tests** (lowest level):
- Test individual functions/utilities
- Examples: validation functions, date helpers, calculations
- Tool: Jest
- Goal: 80%+ coverage of utility functions

2. **Integration Tests**:
- Test API routes with database
- Verify Server Actions work correctly
- Examples: creating user → checking database record exists
- Tool: Vitest with test database

```typescript
describe('createProduct API', () => {
  it('should create product and return id', async () => {
    const response = await POST(request);
    expect(response.status).toBe(201);
    
    const product = await db.products.findUnique(response.data.id);
    expect(product.name).toBe('Test Product');
  });
});
```

3. **E2E Tests** (highest level):
- Test complete user flows (login → create product → checkout)
- Tool: Playwright or Cypress
- Run in browser environment

```typescript
test('user can create product', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password');
  await page.click('text=Login');
  
  await page.goto('/products/new');
  await page.fill('[name=name]', 'New Product');
  await page.click('text=Create');
  
  await expect(page).toContainText('Product created');
});
```

**Testing Best Practices**:
- Write tests BEFORE fixing bugs (prevents regression)
- Mock external API calls
- Use test database separate from production
- Run tests in CI/CD before deployment
- Aim for high coverage on critical paths (auth, payments)"

---

## 8. DEPLOYMENT & DEVOPS

### Q14: Walk me through your deployment process. How do you ensure reliability?

**Model Answer:**
"**Deployment Pipeline**:

1. **Local Development**:
   - `npm run dev` starts Next.js dev server
   - Hot module replacement for instant feedback
   - Environment variables from .env.local

2. **Git Workflow**:
   - Feature branches for new work
   - Pull request reviews before merging
   - GitHub Actions runs tests automatically on PR

3. **Staging Environment**:
   - Deployed from `staging` branch
   - Identical to production (same database type, structure)
   - QA testing and final verification

4. **Production Deployment**:
   - Merge to `main` triggers automatic deployment
   - Vercel detects changes and builds Next.js app
   - Automated tests run before deployment
   - If all pass → Deploy to edge network

**Deployment Process**:
```
Push to main → GitHub Actions test → Build Next.js → 
Deploy to Vercel → Run smoke tests → Monitor metrics
```

**Reliability Measures**:

1. **Database Migrations**:
   - Version control migrations
   - Backward-compatible changes
   - Test migrations on staging first

2. **Monitoring**:
   - Track error rates, response times
   - Set alerts for anomalies
   - Monitor database query performance

3. **Rollback Strategy**:
   - If issues detected post-deployment
   - Revert to previous stable version
   - Automatic rollback if error rate spikes

4. **Health Checks**:
   - `/health` endpoint returns status
   - Checks database connectivity
   - Verifies critical services

```typescript
export async function GET() {
  try {
    await db.healthCheck();
    return Response.json({ status: 'ok' });
  } catch {
    return Response.json({ status: 'error' }, { status: 500 });
  }
}
```

5. **Zero-Downtime Deployment**:
   - Vercel uses blue-green deployments
   - New version deployed alongside old
   - Switch traffic once new version verified
   - If issues, traffic switches back instantly"

---

### Q15: How do you handle database migrations in production?

**Model Answer:**
"**Migration Strategy**:

1. **Development**:
   - Create migration files: `20250614_add_user_roles.sql`
   - Test locally with `npm run migrate:dev`
   - Verify data integrity

2. **Staging**:
   - Run migration on staging database
   - Monitor for performance issues
   - Verify application still works

3. **Production**:
   - Schedule migration during low-traffic window
   - Backup database before migration
   - Run migration with transaction (rollback if fails)

**Example Migration**:
```sql
BEGIN TRANSACTION;

-- Add new column
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';

-- Backfill existing data
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Add constraint
ALTER TABLE users ADD CONSTRAINT check_role 
  CHECK (role IN ('user', 'admin', 'moderator'));

COMMIT;
```

**Best Practices**:
- Keep migrations small and focused
- Make backward-compatible changes (add column with default, don't remove)
- Test rollback procedure
- Monitor query performance after migration
- Communicate downtime to users if needed
- Use feature flags to enable/disable features during migration"

---

## 9. SYSTEM DESIGN & SCALABILITY

### Q16: How would you scale your application if it grew 10x in users?

**Model Answer:**
"**Scaling Strategy**:

1. **Database Scaling**:
   - **Vertical**: Increase CPU/RAM of database server
   - **Horizontal**: Read replicas for query workloads
   - Sharding for extremely large datasets (partition by user_id)
   - Archive old data to separate storage

2. **Caching Layer**:
   - Redis for frequently accessed data
   - Cache user sessions, product catalog
   - Implement cache invalidation strategy

3. **API Performance**:
   - CDN for static assets (images, CSS, JS)
   - API rate limiting to prevent abuse
   - Load balancing across multiple server instances

4. **Frontend Optimization**:
   - Lazy load routes and components
   - Code splitting for smaller bundles
   - Service workers for offline capability

5. **Infrastructure**:
   - Deploy to edge network (Vercel, Cloudflare)
   - Auto-scaling based on traffic
   - Multiple regions for geographic distribution

6. **Monitoring & Observability**:
   - Real-time alerting for issues
   - Track key metrics (response time, error rate, throughput)
   - Distributed tracing for debugging

**Example Scaling Plan**:
- **0-1000 users**: Single server, basic database (current state)
- **1000-10000 users**: Add Redis caching, database indexes, CDN
- **10000-100000 users**: Read replicas, horizontal pod scaling, sharding
- **100000+ users**: Multi-region deployment, advanced caching strategies"

---

## 10. COMMUNICATION & TEAMWORK

### Q17: Tell me about a time you had to debug an issue with a teammate or coordinate on a complex feature.

**Model Answer:**
"**Scenario**: We were building order checkout feature. Backend dev was working on payment processing API, I was building frontend.

**Challenge**: Payment webhook wasn't updating order status in our system.

**How I Approached It**:

1. **Clear Communication**:
   - Asked specific questions: 'What status should order have after payment succeeds?'
   - Shared Slack thread with detailed error logs
   - Set up 30-min sync call instead of back-and-forth messages

2. **Debugging Together**:
   - Backend shared their webhook handler code
   - I showed the database - order stuck in 'processing' status
   - Identified mismatch: webhook expected 'completed' but code checked for 'success'

3. **Documentation**:
   - We documented API contract: expected request/response format
   - Created integration test to prevent future issues
   - Added error logging for webhook failures

4. **Testing**:
   - Tested with production-like webhook payload
   - Used payment provider's test mode
   - Verified order status updated correctly

**Outcome**: Feature shipped without bugs, similar issues prevented.

**Key Learnings**:
- Synchronous communication faster than async for complex issues
- Pair programming effective for knowledge sharing
- Test contracts between systems early
- Document assumptions to prevent miscommunication"

---

## 11. FOLLOW-UP QUESTIONS TO ASK INTERVIEWER

1. "What's the typical debugging approach when you encounter production issues?"
2. "How do you balance technical debt with shipping new features?"
3. "What does your testing strategy look like?"
4. "How does your team handle scaling as the product grows?"
5. "What's the deployment process here?"
6. "How do you monitor application health in production?"
7. "What's the tech stack here? How do you keep dependencies updated?"
8. "What are your biggest technical challenges right now?"

---

## 12. TIPS FOR INTERVIEW SUCCESS

✅ **DO**:
- Tell stories with concrete examples and numbers
- Explain your thought process, not just the solution
- Mention tools and technologies you used
- Discuss trade-offs and why you chose approach X over Y
- Ask clarifying questions
- Admit when you don't know something, show how you'd learn it

❌ **DON'T**:
- Memorize answers word-for-word
- Get too technical without explaining basics
- Make up technologies you haven't used
- Spend 5 minutes on one answer
- Interrupt the interviewer
- Complain about previous experiences

**Structure Your Answers**:
1. **Context**: "We had a problem where..."
2. **Challenge**: "The issue was..."
3. **Action**: "I did X by..."
4. **Result**: "This improved... by...%"
5. **Learning**: "Next time I would..."

---

## 13. COMMON QUESTIONS & QUICK ANSWERS

**"What's your biggest weakness?"**
"I sometimes over-engineer solutions. I've learned to start simple, measure performance, then optimize only where needed."

**"Why are you interested in this role?"**
"I'm excited about [specific tech/problem]. I enjoy both frontend and backend, and your product appeals to me because..."

**"Tell me about a failure."**
"I once deployed without testing. Database migration failed, affecting users. Learned importance of staging environment and automated tests."

**"How do you stay current with technology?"**
"I read release notes, follow developers on Twitter, build small projects with new tech, and subscribe to newsletters like [specific one]."

**"How do you approach learning a new technology?"**
"I start with official docs, build a small project, then apply to real work. I also review others' open-source code to learn patterns."

---

Good luck with your interview! Remember: they're assessing your problem-solving ability, communication, and growth mindset—not expecting you to know everything.
