import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import moment from 'moment';
import {
  each,
  isEmpty,
  isNull,
  range,
  map,
} from 'lodash';
import {
  Alert,
  Button,
  Card,
  Dimmer,
  Form,
  List,
  Header,
  Notification,
} from 'tabler-react';

import config from './duck/config';

import {
  ventasSelectors,
} from './duck';

const i18nComponentKey = 'app.ventas.form';
const propTypes = {};
const defaultProps = {};

class VentasForm extends Component {
  /**
  * class constructor
  * @param {obj} props - Component properties
  * @return {void}
  */
  constructor(props) {
    super(props);
    const id = parseInt(props.match.params.id, 10) || null;
    this.state = {
      alert: {
        display: false,
        type: 'danger',
        message: '',
      },
      errors: {
        promociones_tipos_inmuebles: '',
        visitas: '',
      },
      values: {
        id,
        promociones_tipos_inmuebles: '',
        visita: {
          id: null,
          apellidos: '',
        },
        promociones_id: '',
        tipos_inmuebles: [],
      },
      loading: false,
      promociones: {},
      redirect: {
        enabled: false,
        url: config.PATHS.ventas,
        timeout: config.REDIRECT.timeout,
      },
      modal: {
        display: false,
        candidates: {},
      },
    };
    each(ventasSelectors, (_, k) => this[k] = ventasSelectors[k].bind(this));
  }

  componentDidMount() {
    this.didMout();
  }

  /**
  * component render method
  * @return {reactElement} - react element itself
  */
  render() {
    const { intl } = this.props;
    const { values, errors, promociones, alert, redirect, loading, modal } = this.state;

    if (isEmpty(promociones)) {
      return <Fragment />;
    }

    const inmuebles_promocion = !values.promociones_id ? [] : promociones[values.promociones_id].inmuebles;

    console.log({ inmuebles_promocion });

    if (redirect.enabled) {
      return <Redirect to={redirect.url} />;
    }

    return (
      <Fragment>
        <Card>
          <Card.Header>
            <Header.H3>{
              !values.id
                ? intl.formatMessage({ id: `${i18nComponentKey}.title-anadir`, defaultMessage: `${i18nComponentKey}.title-anadir` })
                : intl.formatMessage({ id: `${i18nComponentKey}.title-editar`, defaultMessage: `${i18nComponentKey}.title-editar` })
            }
            </Header.H3>
          </Card.Header>
          <Card.Body>
            {alert.display && <Alert type={alert.type} icon="alert-triangle">{alert.message}</Alert>}
            <Dimmer active={loading} loader>
              <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.visita`, defaultMessage: `${i18nComponentKey}.visita` })}>
                <Form.Input
                  feedback={errors.visitas}
                  invalid={errors.visitas !== ''}
                  value={values.visita.name}
                  onChange={this.handleVisita}
                  onKeyPress={this.catchReturn}
                />
              </Form.Group>
              <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.promociones`, defaultMessage: `${i18nComponentKey}.promociones` })}>
                  <Form.Select
                    value={values.promociones_id}
                    onChange={e => this.handlePromocion(e, 'promociones_id')}
                  >
                    <option />
                    {map(promociones, ({ id, name }) => <option value={id} key={`${i18nComponentKey}-promocion-${id}`}>{name}</option>)}
                  </Form.Select>
                  {map(inmuebles_promocion, inmueble => (
                  <Form.Checkbox
                    key={`${i18nComponentKey}-checkbox-${inmueble.id}`}
                    label={inmueble.name}
                    name={inmueble.id}
                    value={inmueble.id}
                    checked={values.tipos_inmuebles_1.indexOf(parseInt(inmueble.id, 10)) !== -1}
                    onChange={e => this.handleInmuebles(inmueble.id, 'tipos_inmuebles_1')}
                  />
                ))}
                </Form.Group>
            </Dimmer>
          </Card.Body>
          <Card.Footer>
            <Button.List>
              <Button square color="success" onClick={this.submit}>
                {intl.formatMessage({ id: `${i18nComponentKey}.save`, defaultMessage: `${i18nComponentKey}.save` })}
              </Button>
            </Button.List>
          </Card.Footer>
        </Card>
        {modal.display &&
          <Fragment> 
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{intl.formatMessage({ id: `${i18nComponentKey}.modal.title`, defaultMessage: `${i18nComponentKey}.modal.title` })}</h5>
                    <button type="button" onClick={this.hideModal} className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true" />
                    </button>
                  </div>
                  <div className="modal-body">
                  <List>
                    {map(modal.candidates, data => {
                      const li = name => (
                        <List.Item key={`${i18nComponentKey}.li.${data.id}`}>
                          <span onClick={e => this.setValue('visita', { id: data.id, name }, () => this.hideModal(new Event('click')))}>
                            {name}
                          </span>
                        </List.Item>);
                      let name = data.apellido_1;
                      if (data.name !== '' && data.apellido_1 !== '') {
                        name = `${data.apellido_1}, ${data.name}`;
                      } else if (data.name !== '') {
                        name = data.name;
                      }
                      return li(name);
                    })}
                  </List>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={this.hideModal} className="btn btn-secondary" data-dismiss="modal">{intl.formatMessage({ id: `${i18nComponentKey}.modal.close`, defaultMessage: `${i18nComponentKey}.modal.close` })}</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" />
          </Fragment>
        }
      </Fragment>
    );
  }
}

VentasForm.propTypes = propTypes;
VentasForm.defaultProps = defaultProps;

export default injectIntl(
  connect(
    // mapStateToProps
    state => ({
      session: state.session,
    }),
    // mapActionsToProps
    dispatch => bindActionCreators({
      //functName,
    }, dispatch),
  )(VentasForm));
