"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { api } from "@/src/services/baseApi";
import {
  setAuthToken,
  selectAuthStatus,
  selectCurrentUser,
  setAuthLoading
} from "@/src/features/auth/authSlice";
import { getStoredAuthToken } from "@/src/features/auth/tokenStorage";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const user = useAppSelector(selectCurrentUser);
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    if (status === "succeeded" && user) return;

    initiated.current = true;

    const token = getStoredAuthToken();
    if (!token) return;

    dispatch(setAuthToken(token));
    dispatch(setAuthLoading());
    dispatch(
      api.endpoints.getMe.initiate(undefined, {
        forceRefetch: true,
        subscribe: false
      })
    );
  }, [dispatch, status, user]);

  return null;
}
