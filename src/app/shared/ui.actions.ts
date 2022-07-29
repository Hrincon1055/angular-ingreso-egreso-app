import { createAction } from '@ngrx/store';

export const isLoading = createAction('[UI Loading] isLoading');
export const stopLoading = createAction('[UI Loading] stopLoading');
