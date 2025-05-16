import AdminLayout from "../AdminLayout";
import CategoryTable from "./components/CategoryTable";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { fetchCategories } from "../../../store/adminCategorySlice";

interface ICategory {
  id: string;
  categoryName: string;
}
function Category() {
  const categories: ICategory[] = useAppSelector(
    (store) => store.category.items
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);
  return (
    <AdminLayout>
      <CategoryTable categories={categories} />
    </AdminLayout>
  );
}

export default Category;
