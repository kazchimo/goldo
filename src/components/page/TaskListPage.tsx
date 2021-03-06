import {
  Grid,
  List,
  ListSubheader,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskAddForm } from "../molecules/TaskAddForm";
import { TaskListItem } from "../molecules/TaskListItem";
import { TaskMindMap } from "../organisms/TaskMindMap";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(4),
  },
  container: {
    maxWidth: 800,
    marginLeft: "auto",
    marginRight: "auto",
  },
  mapPaper: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const TaskListPage: React.FC = () => {
  const { taskListEntities, tasksViewByListId } = useSelectors(
    { ...taskListsSelector, ...tasksSelector },
    "taskListEntities",
    "tasksViewByListId"
  );
  const { moveTask } = useBoundActions(tasksActions);
  const { listId } = useParams<{ listId: string }>();
  const classes = useStyles();

  const taskList = taskListEntities[listId];
  const tasks = tasksViewByListId[listId] || [];

  return (
    <DragDropContext
      onDragEnd={(v) => {
        const task = tasks[v.source.index];
        if (v.combine) {
          moveTask({ task: task, parent: v.combine.draggableId });
        } else {
          const destinationId =
            v.destination && v.destination.index > 0
              ? v.source.index < v.destination.index
                ? tasks[v.destination.index].id
                : tasks[v.destination.index - 1].id
              : undefined;
          v.destination && moveTask({ task: task, previous: destinationId });
        }
      }}
    >
      {taskList && (
        <Grid className={classes.container}>
          <Paper className={classes.paper}>
            <List
              subheader={
                <ListSubheader>
                  {taskList.title}
                  <TaskAddForm taskList={taskList} />
                </ListSubheader>
              }
            >
              <Droppable droppableId={"taskList"} isCombineEnabled>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task, i) => (
                      <Draggable key={task.id} draggableId={task.id} index={i}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskListItem task={task} taskList={taskList} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </List>
          </Paper>
          <Typography variant={"h5"}>Task Map</Typography>
          <Paper className={classes.mapPaper} variant={"outlined"}>
            <TaskMindMap taskList={taskList} />
          </Paper>
        </Grid>
      )}
    </DragDropContext>
  );
};
