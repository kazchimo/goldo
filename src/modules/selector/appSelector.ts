import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const selector = createSelector(selectSelf, (s) => s.app);

const openTasks = createSelector(selector, (s) => s.openTasks);

const sideBarOpen = createSelector(selector, (s) => s.sideBarOpen);

const defaultListId = createSelector(selector, (s) => s.defaultListId);

export const appSelector = {
  openTasks,
  sideBarOpen,
  defaultListId,
  finishInitialLoading: createSelector(
    selector,
    ({ fetchTaskListsCount, fetchTasksCount }) =>
      fetchTaskListsCount &&
      fetchTasksCount &&
      fetchTaskListsCount === fetchTasksCount
  ),
};
