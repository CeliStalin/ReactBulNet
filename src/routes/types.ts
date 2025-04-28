import { ComponentType } from 'react';

export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  public?: boolean;
  roles?: string[];
  title?: string;
}