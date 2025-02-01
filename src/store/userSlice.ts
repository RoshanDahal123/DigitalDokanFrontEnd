import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";

const initialState: User = {
  name: "Roshan dahal",
  age: 22,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setName(state: User, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setAge(state: User, action: PayloadAction<number>) {
      state.age = 23;
    },
  },
});
//actions
export const { setName, setAge } = userSlice.actions;
export default userSlice.reducer;
