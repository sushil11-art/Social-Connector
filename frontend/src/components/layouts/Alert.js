import React from "react";

import { connect } from "react-redux";

const Alert = ({ alerts }) => {
  if (alerts !== null && alerts.length > 0) {
    return alerts.map((alert) => {
      return (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      );
    });
  } else {
    return null;
  }
};

const mapStateToProps = (state) => ({ alerts: state.alert });

export default connect(mapStateToProps)(Alert);
