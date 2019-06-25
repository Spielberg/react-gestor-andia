import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  map,
  size,
} from 'lodash';
import {
  Alert,
  Form,
} from 'tabler-react';

import {
  enviosSelectors,
} from './duck';

const i18nComponentKey = 'app.envios.index.hoc';

function enviosHOC(WrappedComponent) {
  
  class Modal extends Component {

    constructor(props) {
      super(props);
      this.state = {
        alert: {
          display: false,
          type: 'success',
          message: '',
        },
        candidates: [],
        cb: () => (null),
        display: false,
        templates: {},
        template: '',
      };
      map(enviosSelectors, (_,w) => this[w] = enviosSelectors[w].bind(this));
    }

    render() {
      const { intl } = this.props;
      const { display } = this.state;
      const count = size(this.state.candidates);

      return (
        <Fragment>
          {display && <Fragment>
              <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{intl.formatMessage({ id: `${i18nComponentKey}.modal.title`, defaultMessage: `${i18nComponentKey}.modal.title` })}</h5>
                      <button type="button" onClick={this.close} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" />
                      </button>
                    </div>
                    <div className="modal-body">
                      {alert.display && <Alert type={alert.type} icon="alert-triangle">{alert.message}</Alert>}
                      <p>{count === 1                        
                        ? intl.formatMessage({ id: `${i18nComponentKey}.modal.body.one`, defaultMessage: `${i18nComponentKey}.modal.body.one` })
                        : intl.formatMessage({ id: `${i18nComponentKey}.modal.body.many`, defaultMessage: `${i18nComponentKey}.modal.body.many` }, { count })}
                      </p>
                      <Form.Group label={this.props.intl.formatMessage({ id: `${i18nComponentKey}.select.template`, defaultMessage: `${i18nComponentKey}.select.template` })}>
                        <Form.Select value={this.state.template} onChange={this.handleTemplate}>
                          <option />
                          {map(this.state.templates, (obj) => (
                            <option key={`${i18nComponentKey}-select-${obj.id}`} value={obj.id}>
                              {obj.value}
                            </option>))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="modal-footer">
                      {count === 0 || this.state.template === ''
                        ? <button type="button" disabled className="btn btn-primary">{intl.formatMessage({ id: `${i18nComponentKey}.modal.confirm`, defaultMessage: `${i18nComponentKey}.modal.confirm` })}</button>
                        : <button type="button" onClick={this.handleConfirm} className="btn btn-primary">{intl.formatMessage({ id: `${i18nComponentKey}.modal.confirm`, defaultMessage: `${i18nComponentKey}.modal.confirm` })}</button>
                      }                      
                      <button type="button" onClick={this.close} className="btn btn-secondary" data-dismiss="modal">{intl.formatMessage({ id: `${i18nComponentKey}.modal.close`, defaultMessage: `${i18nComponentKey}.modal.close` })}</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show" />
            </Fragment>}
          <WrappedComponent
            modalEnvios={{ open: this.open }}
            {...this.props}
            {...this.state}
          />
        </Fragment>
      );
    }
  }

  Modal.propTypes = {};

  Modal.defaultProps = {};

  return injectIntl(
    connect(
      // mapStateToProps
      state => ({
        session: state.session,
      }),
    )(Modal));
}

export default enviosHOC;
