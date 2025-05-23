/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as WorkflowWorkflowIdImport } from './routes/workflow.$workflowId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const WorkflowWorkflowIdRoute = WorkflowWorkflowIdImport.update({
  id: '/workflow/$workflowId',
  path: '/workflow/$workflowId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/workflow/$workflowId': {
      id: '/workflow/$workflowId'
      path: '/workflow/$workflowId'
      fullPath: '/workflow/$workflowId'
      preLoaderRoute: typeof WorkflowWorkflowIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/workflow/$workflowId': typeof WorkflowWorkflowIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/workflow/$workflowId': typeof WorkflowWorkflowIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/workflow/$workflowId': typeof WorkflowWorkflowIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/workflow/$workflowId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/workflow/$workflowId'
  id: '__root__' | '/' | '/workflow/$workflowId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  WorkflowWorkflowIdRoute: typeof WorkflowWorkflowIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  WorkflowWorkflowIdRoute: WorkflowWorkflowIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/workflow/$workflowId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/workflow/$workflowId": {
      "filePath": "workflow.$workflowId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
