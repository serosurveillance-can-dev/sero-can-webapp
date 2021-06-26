import { Location, LocationListener, UnregisterCallback } from 'history'
import { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'

const sendPageView: LocationListener = (location: Location): void => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
}
interface eventSenderProps {
  category: string,
  label: string,
  action: string
}

export const sendAnalyticsEvent = (props: eventSenderProps) => {
  const cookieAcceptance = localStorage.getItem('acceptedCookies');
  if (cookieAcceptance) {
    ReactGA.event(props);
  }
}
interface Props {
  children: JSX.Element;
  trackingId: string;
}
const GAListener = ({ children, trackingId }: Props): JSX.Element => {
  const isDev = process.env.NODE_ENV === "development";
  const history = useHistory()
  useEffect((): UnregisterCallback | void => {
    ReactGA.initialize(trackingId,
      {
        titleCase: false,
        debug: isDev,
        gaOptions: {
          cookieDomain: isDev ? 'none' : 'auto'
        }
      })
    sendPageView(history.location, 'REPLACE')
    return history.listen(sendPageView)
  }, [history, isDev, trackingId])

  return children
}

export default GAListener