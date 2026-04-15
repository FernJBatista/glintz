import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: string;
};

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiFailure;

export function successJson<T>(data: T, init?: ResponseInit): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status: 200, ...init });
}

export function failureJson(error: string, status = 400): NextResponse<ApiFailure> {
  return NextResponse.json({ success: false, error }, { status });
}
