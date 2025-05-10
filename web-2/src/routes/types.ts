import { RouteObject } from "react-router";
import { SvgIconProps } from "@mui/material";

type SidebarConfig = {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
}

export type RouteConfig = RouteObject & {
  public?: boolean;
  children?: RouteConfig[];
  sidebar?: SidebarConfig;
};