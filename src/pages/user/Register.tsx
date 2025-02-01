import React from "react";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import { setAge, setName } from "../../store/userSlice";

/**
 * Register component handles the user registration process.
 *
 * @remarks
 * This component uses `useDispatch` and `useSelector` hooks from React Redux.
 *
 * @function useDispatch
 * The `useDispatch` hook is used to dispatch actions to the Redux store.
 * It returns a reference to the `dispatch` function from the Redux store.
 * no type , external type must be given
 *
 * @function useSelector
 * The `useSelector` hook is used to extract data from the Redux store state.
 * It takes a selector function as an argument and returns the selected state.
 * no type ,external type must be given
 */
function Register() {
  const data = useAppSelector((store) => store.user);
  console.log(data);
  const dispatch = useAppDispatch();

  dispatch(setName("hari bahadur"));
  dispatch(setAge(34));
  return <div>Register Me</div>;
}

export default Register;
