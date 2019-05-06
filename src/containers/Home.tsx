import React, { useEffect } from "react";

import { homeActions } from "../redux/modules/home";
import { RouteComponentProps } from "react-router";
import { AppState } from "../redux/state";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

interface StateProps {
  redirectToLogin: boolean;
  redirectToTodos: boolean;
}

interface DispatchProps {
  waiting: () => void;
  resetState: () => void;
}

type EnhancedProps = StateProps & DispatchProps & RouteComponentProps;

const HomeContainer: React.FC<EnhancedProps> = ({
  redirectToLogin,
  redirectToTodos,
  waiting,
  resetState,
  history
}) => {
  useEffect(() => {
    if (redirectToLogin) {
      history.replace("/login");
    } else if (redirectToTodos) {
      history.replace("/todos");
    } else {
      waiting();
    }

    return () => resetState();
  }, [redirectToLogin, redirectToTodos]);

  return <></>;
};

const mapStateToProps = (state: AppState): StateProps => ({
  redirectToLogin: state.home.redirectToLogin,
  redirectToTodos: state.home.redirectToTodos
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      waiting: () => homeActions.waiting(),
      resetState: () => homeActions.resetState()
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeContainer);
