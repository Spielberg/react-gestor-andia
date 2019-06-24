import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import {
  ceil,
  chunk,
  each,
  isEmpty,
  map,
} from 'lodash';
import {
  Alert,
  Button,
  Card,
  Dimmer,
  Form,
  Grid,
  Header,
  List,
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
        tipos_inmuebles_id: '',
        visita: '',
      },
      values: {
        id,
        tipos_inmuebles_id: '',
        visita: {
          id: null,
          apellidos: '',
        },
        promocion_id: '',
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

    const inmuebles_promocion = !values.promocion_id ? [] : promociones[values.promocion_id].inmuebles;

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
                  feedback={errors.visita}
                  invalid={errors.visita !== ''}
                  value={values.visita.apellidos}
                  onChange={this.handleVisita}
                  onKeyPress={this.catchReturn}
                />
              </Form.Group>
              <Form.Group label={intl.formatMessage({ id: `${i18nComponentKey}.promociones`, defaultMessage: `${i18nComponentKey}.promociones` })}>
                <Form.Select
                  value={values.promocion_id}
                  onChange={e => this.handlePromocion(e, 'promocion_id')}
                  feedback={errors.tipos_inmuebles_id}
                  invalid={errors.tipos_inmuebles_id !== ''}
                >
                  <option />
                  {map(promociones, ({ id, name }) => <option value={id} key={`${i18nComponentKey}-promocion-${id}`}>{name}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Grid.Row>
                  {map(chunk(inmuebles_promocion, ceil(inmuebles_promocion.length / 2)), (arr, i) => (
                    <Grid.Col key={`${i18nComponentKey}-grid-col-input-${i}`}>
                      {map(arr, inmueble => (
                        <Form.Checkbox
                          key={`${i18nComponentKey}-checkbox-${inmueble.id}`}
                          label={inmueble.name}
                          name={inmueble.id}
                          value={inmueble.id}
                          checked={inmueble.id === values.tipos_inmuebles_id}
                          onChange={e => this.setValue('tipos_inmuebles_id', parseInt(e.target.value, 10))}
                        />
                      ))}
                    </Grid.Col>
                  ))}
                  </Grid.Row>
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
                      <List.Group className="modal-list">
                        {map(modal.candidates, data => {
                          const li = name => (
                            <a
                              key={`${i18nComponentKey}.li.${data.id}`}
                              className="list-group-item"
                              onClick={e => this.setValue('visita', { id: data.id, apellidos: name }, () => this.hideModal(new Event('click')))}>
                              {name}
                            </a>);
                          let name = data.apellido_1;
                          if (data.name !== '' && data.apellido_1 !== '') {
                            name = `${data.apellido_1}, ${data.name}`;
                          } else if (data.name !== '') {
                            name = data.name;
                          }
                          return li(name);
                        })}
                      </List.Group>
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
