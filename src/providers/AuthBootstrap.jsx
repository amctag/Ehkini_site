"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { api } from "@/src/services/baseApi";
import {
  selectAuthStatus,
  selectCurrentUser,
  setAuthLoading
} from "@/src/features/auth/authSlice";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const user = useAppSelector(selectCurrentUser);
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    if (status === "succeeded" && user) return;

    initiated.current = true;
    dispatch(setAuthLoading());
    dispatch(api.endpoints.getMe.initiate());
  }, [dispatch, status, user]);

  return null;
}
