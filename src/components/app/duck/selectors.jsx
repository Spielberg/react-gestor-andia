import config from './config';

function displayLoading (cb = () => (null)) {
  this.setState({
    loading: true,
  }, cb);
};

function hideLoading(cb = () => (null)) {
  this.setState({
    loading: false,
  }, cb);
};

function setLocale(locale, cb = () => (null)) {
  if (config.I18N.langs.indexOf(locale) === -1) {
    return;
  }
  this.setState({ locale }, cb)
}

function setStats(stats, cb = () => (null)) {
  this.setState({ stats }, cb)
}

export default {
  displayLoading,
  hideLoading,
  setLocale,
  setStats,
};
