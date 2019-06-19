import React, { useEffect } from "react";

import { homeActions, HomeState } from "../redux/modules/home";
import { AppState } from "../redux/state";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

const HomeContainer: React.FC = () => {
  const { history } = useReactRouter();
  const { redirectToLogin, redirectToTodos } = useSelector<AppState, HomeState>(
    state => state.home
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (redirectToLogin) {
      history.replace("/login");
    } else if (redirectToTodos) {
      history.replace("/todos");
    } else {
      dispatch(homeActions.waiting());
    }

    return () => {
      dispatch(homeActions.resetState());
    };
  }, [dispatch, history, redirectToLogin, redirectToTodos]);

  return <></>;
};

export default HomeContainer;
