import { Dialog, Divider, Grid, makeStyles } from "@material-ui/core";
import { parseISO } from "date-fns";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { ReactEventHandler } from "react";
import * as Yup from "yup";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";
import { DeleteTaskButton } from "../atoms/DeleteTaskButton";
import { TaskModalDueField } from "../atoms/TaskModalDueField";
import { TaskModalNotesField } from "../atoms/TaskModalNotesField";
import { TaskModalTitleField } from "../atoms/TaskModalTitleField";
import { TaskListsSelect } from "../molecules/TaskListsSelect";
import { TaskModalSubTask } from "../molecules/TaskModalSubTask";

type Props = {
  open: boolean;
  task: TaskView;
  onBackdropClick: ReactEventHandler<{}>;
  taskList: TaskList;
};

const useStyles = makeStyles({
  container: {
    padding: 16,
    minWidth: "fit-content",
  },
  form: {
    width: 340,
  },
});

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

export const TaskEditModal: React.FC<Props> = ({
  open,
  task,
  onBackdropClick,
  taskList,
}) => {
  const classes = useStyles();
  const { updateTask } = useBoundActions(tasksActions);

  const initialValues = {
    title: task.title,
    notes: task.notes,
    due: task.due ? parseISO(task.due) : undefined,
    listId: task.listId,
  };

  type Values = typeof initialValues;

  const onSubmit = (v: Values, { setSubmitting }: FormikHelpers<Values>) => {
    const updated = { ...task, ...v, due: v.due?.toISOString() };
    updateTask({ task: updated, taskId: task.id, listId: task.listId });
    setSubmitting(false);
  };

  const submit = ({
    submitForm,
    errors,
    dirty,
  }: FormikProps<Values>): ReactEventHandler<{}> => (e) => {
    if (dirty) {
      submitForm().then(() => {
        if (Object.values(errors).every((e) => !e)) {
          onBackdropClick(e);
        }
      });
    } else {
      onBackdropClick(e);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={schema}
    >
      {(props) => (
        <Dialog
          open={open}
          onBackdropClick={submit(props)}
          PaperProps={{
            className: classes.container,
          }}
        >
          <Grid container spacing={4} justify={"space-between"}>
            <Grid item xs={12}>
              <DeleteTaskButton task={task} />
            </Grid>
            <Grid container item xs={12} justify={"space-between"}>
              <Grid item className={classes.form}>
                <Grid container direction="column" spacing={2} component={Form}>
                  <Grid item>
                    <TaskModalTitleField />
                  </Grid>
                  <Grid item>
                    <TaskModalNotesField />
                  </Grid>
                  <Grid item>
                    <TaskListsSelect />
                  </Grid>
                  <Grid item>
                    <Divider />
                  </Grid>
                  <Grid item>
                    <TaskModalDueField setFieldValue={props.setFieldValue} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <TaskModalSubTask task={task} taskList={taskList} />
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
      )}
    </Formik>
  );
};
