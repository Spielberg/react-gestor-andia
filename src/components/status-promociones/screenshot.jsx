import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import {
  Alert,
  Button,
  Form,
} from 'tabler-react';
import {
  upperFirst,
} from 'lodash';

import config from './duck/config';

const i18nComponentKey = 'app.status-promociones.screenshot';
const propTypes = {
  displaySuccess: PropTypes.func.isRequired,
  int: intlShape,
  bearer: PropTypes.string,
};
const defaultProps = {
  bearer: '',
};


moment().locale('es');

const Screenshot = (props) => {
  var currentDate = moment().startOf("month");
  var defaultName =  `${upperFirst(currentDate.format('MMMM'))} ${currentDate.format('YYYY')}`;

  const { bearer, displaySuccess, intl } = props;
  const [name, setName] = useState(defaultName);
  const [alert, setAlert] = useState();
  const [modal, setModal] = useState(false);
  const hide = () => {
    setName(defaultName);
    setAlert();
    setModal(false);
  };
  const push = () => {
    setAlert();
    axios.post(config.SCEENSHOTS.url, { name }, {
    headers: {
      Authorization: `Bearer ${bearer}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status !== 200 && response.status !== 204) {
        setAlert(`Status erros in fetchStats expected 200 or 204 received ${response.status}`);
        return;
      }
      if (response.data.error) {
        setAlert(response.data.message);
        return;
      }
      displaySuccess(intl.formatMessage({ id: `${i18nComponentKey}.sucess-alert`, defaultMessage: `${i18nComponentKey}.sucess-alert` }));
      hide();
    })
    .catch(({ message }) => {
      setAlert(message);
    });
  };
  return (<>
    {modal &&
      <>
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{intl.formatMessage({ id: `${i18nComponentKey}.modal.title`, defaultMessage: `${i18nComponentKey}.modal.title` })}</h5>
                <button type="button" onClick={hide} className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" />
                </button>
              </div>
              <div className="modal-body">
                {alert && <Alert type="danger" icon="alert-triangle">{alert}</Alert>}
                <Form.Input
                  label={intl.formatMessage({ id: `${i18nComponentKey}.modal.input.name`, defaultMessage: `${i18nComponentKey}.modal.input.name` })}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={push} className="btn btn-success" data-dismiss="modal" disabled={!name}>
                  {intl.formatMessage({ id: `${i18nComponentKey}.modal.save`, defaultMessage: `${i18nComponentKey}.modal.save` })}
                </button>
                <button type="button" onClick={hide} className="btn btn-secondary" data-dismiss="modal">
                  {intl.formatMessage({ id: `${i18nComponentKey}.modal.close`, defaultMessage: `${i18nComponentKey}.modal.close` })}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" />
      </>
    }
    <Button className="btn-screenshot" color="gray" icon="upload" onClick={() => setModal(true)}>
      {intl.formatMessage({ id: `${i18nComponentKey}.btn`, defaultMessage: `${i18nComponentKey}.btn` })}
    </Button>
    </>
  );
}

Screenshot.propTypes = propTypes;
Screenshot.defaultProps = defaultProps;

export default injectIntl(connect(
      // mapStateToProps
      state => ({
        bearer: state.session.authToken || '',
      }),
    )(Screenshot));
