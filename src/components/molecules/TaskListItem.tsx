import {
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import _ from "lodash";
import React, { memo, useCallback, useState } from "react";
import { hasDue, TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskCompleteButton } from "../atoms/TaskCompleteButton";
import { TaskDue } from "../atoms/TaskDue";
import { TaskEditModal } from "../organisms/TaskEditModal";

type Props = {
  task: TaskView;
  taskList: TaskList;
  index: number;
};

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  secondaryText: {
    overflowWrap: "anywhere",
  },
}));

export const TaskListItem: React.FC<Props> = memo(
  ({ task, index, taskList }) => {
    const [openSubtask, setOpenSubtask] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const classes = useStyles();
    const { completeTask } = useBoundActions(tasksActions);
    const [mouseEnter, setMouseEnter] = useState(false);

    const hasChildren = task.children.length > 0;

    const finishTask = useCallback(() => {
      completeTask(task);
    }, [task]);

    return (
      <>
        <TaskEditModal
          taskList={taskList}
          open={openEditModal}
          task={task}
          onBackdropClick={() => setOpenEditModal(false)}
        />
        <ListItem
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
          onClick={hasChildren ? () => setOpenSubtask((a) => !a) : () => {}}
        >
          <ListItemIcon>
            <TaskCompleteButton onClick={finishTask} />
          </ListItemIcon>
          <Grid container alignItems={"center"}>
            <Grid item xs={11}>
              <ListItemText
                secondary={task.notes}
                secondaryTypographyProps={{
                  className: classes.secondaryText,
                }}
              >
                {task.title}
                {hasDue(task) && <TaskDue task={task} />}
              </ListItemText>
            </Grid>
            <Grid item xs={1}>
              {mouseEnter && (
                <IconButton
                  size={"small"}
                  onClick={() => setOpenEditModal(true)}
                >
                  <EditIcon fontSize={"small"} />
                </IconButton>
              )}
            </Grid>
          </Grid>
          {hasChildren && (
            <IconButton size={"small"}>
              {openSubtask ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </ListItem>
        {hasChildren && (
          <Collapse in={openSubtask}>
            {openSubtask && (
              <List dense className={classes.nested}>
                {task.children.map((child, idx) => (
                  <TaskListItem
                    task={child}
                    index={idx}
                    key={child.id}
                    taskList={taskList}
                  />
                ))}
              </List>
            )}
          </Collapse>
        )}
      </>
    );
  },
  (a, b) =>
    a.taskList === b.taskList &&
    _.isEqual(a.task.children, b.task.children) &&
    a.task.title === b.task.title &&
    a.task.parent === b.task.parent &&
    a.task.notes === b.task.notes &&
    a.task.due === b.task.due
);
