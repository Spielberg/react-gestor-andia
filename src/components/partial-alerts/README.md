# Partial alerts

configuration:
  PARTIAL_ALERTS
    TIMEOUT: number in miliseconds overwrite: process.env.PARTIAL_ALERTS_TIMEOUT
    INCLUDE_ANIMATION: bool https://daneden.github.io/animate.css/ overwrite: process.env.PARTIAL_ALERTS_INCLUDE_ANIMATION
    DEFAULT_STYLE: overwrite: process.env.PARTIAL_ALERTS_DEFAULT_STYLE

style:
  - bulma: https://bulma.io/documentation/elements/notification/
    types:
      - danger
      - info
      - primary
      - success
      - warning
  - bootstrap: https://getbootstrap.com/docs/4.1/components/alerts/
    types:
      - danger
      - dark
      - info
      - light
      - primary
      - secondary
      - success
      - warning