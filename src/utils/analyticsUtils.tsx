import { Location, LocationListener, UnregisterCallback } from 'history'
import { useEffect, useContext } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router'
import { AppContext } from '../context'

const sendPageView: LocationListener = (location: Location): void => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
}
interface eventSenderProps {
  category: string,
  label: string,
  action: string
}

let cookieAcceptance = false;

export const sendAnalyticsEvent = (props: eventSenderProps) => {
  if (cookieAcceptance) {
    ReactGA.event(props)
  }
}
interface Props {
  children: JSX.Element;
  trackingId?: string;
}
const GAListener = ({ children, trackingId }: Props): JSX.Element => {
  const isDev = process.env.NODE_ENV === "development";
  const history = useHistory()
  const [state] = useContext(AppContext);
  useEffect((): UnregisterCallback | void => {
    cookieAcceptance = state.acceptedCookies;
    if (trackingId && cookieAcceptance) {
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
    }
  }, [history, isDev, state.acceptedCookies, trackingId])

  return children
}

export default GAListener