import { IconButton, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import React, { useRef, useState, VFC } from "react";
import { useBool } from "../../lib/hooks/useBool";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { appSelector } from "../../modules/selector/appSelector";
import { appActions } from "../../modules/slice/appSlice";
import { SearchResult } from "../organisms/SearchResult";

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
  startAdornment: {
    marginLeft: theme.spacing(1),
  },
  resultContainer: {
    position: "absolute",
    right: 410,
  },
}));

export const TaskSearchForm: VFC = () => {
  const classes = useStyles();
  const { searchWord } = useSelectors(appSelector, "searchWord");
  const { enqueueUpdateSearchWord, resetSearchWord } = useBoundActions(
    appActions
  );
  const ref = useRef<Element>(null);
  const [shouldShow, setShouldShowTrue] = useBool();
  const [word, setWord] = useState("");

  return (
    <>
      <InputBase
        ref={ref}
        onFocus={setShouldShowTrue}
        startAdornment={<SearchIcon />}
        endAdornment={
          searchWord !== "" ? (
            <IconButton size={"small"} onClick={resetSearchWord}>
              <ClearIcon />
            </IconButton>
          ) : (
            <></>
          )
        }
        className={classes.input}
        value={word}
        onChange={(v) => {
          setWord(v.target.value);
          enqueueUpdateSearchWord(v.target.value);
        }}
        classes={{
          inputAdornedStart: classes.startAdornment,
        }}
        placeholder="Search Tasks"
      />
      {shouldShow && (
        <div className={classes.resultContainer}>
          <SearchResult />
        </div>
      )}
    </>
  );
};
