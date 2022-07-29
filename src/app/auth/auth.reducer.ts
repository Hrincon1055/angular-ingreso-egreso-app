import { createReducer, on, Action } from '@ngrx/store';
import { setUser, unSetUser } from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
  user: Usuario | null | undefined;
}

export const initialState: State = {
  user: null,
};

const _authReducer = createReducer<State, Action>(
  initialState,

  on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(unSetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state: State = initialState, action: Action) {
  return _authReducer(state, action);
}
