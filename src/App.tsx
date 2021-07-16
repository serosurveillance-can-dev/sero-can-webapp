import React, { useContext, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import './App.css';
import About from './components/pages/About';
import NotFoundPage from './components/pages/NotFoundPage';
import CookiePolicy from "./components/pages/CookiePolicy";
import Explore from "./components/pages/Dashboard/Explore";
import Data from './components/pages/Data';
import Publications from "./components/pages/Publications/Publications";
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfUse from "./components/pages/TermsOfUse";
import { CookieBanner } from "./components/shared/CookieBanner";
import { NavBar } from "./components/shared/NavBar";
import { Footer } from "./components/shared/Footer";
import TableauEmbed from "./components/shared/TableauEmbed";
import { AppContext, getEmptyFilters } from "./context";
import httpClient from "./httpClient";
import { LanguageType, PageStateEnum } from "./types";
import { setLanguageType } from "./utils/translate/translateService";
import { ANALYZE_URLS, CANADA_URLS } from "./constants";

function App() {
  const [{ language, explore }, dispatch] = useContext(AppContext);
  setLanguageType(language);

  // General call that happens once at the start of everything.
  useEffect(() => {
    const api = new httpClient();
    const allFilterOptions = async () => {
      const { options, updatedAt, maxDate, minDate } = await api.getAllFilterOptions();
      dispatch({
        type: 'GET_ALL_FILTER_OPTIONS',
        payload: options
      })

      dispatch({
        type: "UPDATED_AT",
        payload: updatedAt
      })

      dispatch({
        type: "MAX_MIN_DATES",
        payload: { maxDate, minDate }
      })
    }

    allFilterOptions();
    // We only want this to run once so we pass no dependencies. Do not remove this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // pulls from ISO api to get standardized country names, codes and translations
  useEffect(() => {
    const updateCountriesJson = async () => {
      const api = new httpClient()
      const countriesJson = await api.httpGet("https://restcountries.eu/rest/v2/", false);
      dispatch({
        type: 'UPDATE_COUNTRIES_JSON',
        payload: countriesJson
      });
    }
    updateCountriesJson();
  }, [dispatch])

  // Cookie managing
  useEffect(() => {
    const alreadyAcceptedCookes = localStorage.getItem('acceptedCookies');
    if (alreadyAcceptedCookes) {
      dispatch({
        type: 'ACCEPT_COOKIES'
      });
    }
    const handleResize = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', handleResize)

    handleResize();
  }, [dispatch])

  const listenForUrlLanguage = (pathname: string) => {
    if (pathname.includes("/en/") && language !== LanguageType.english) {
      dispatch({
        type: "SELECT_LANGUAGE",
        payload: LanguageType.english
      })
    }
    else if (pathname.includes("/fr/") && language !== LanguageType.french) {
      dispatch({
        type: "SELECT_LANGUAGE",
        payload: LanguageType.french
      })
    }
  }

  const history = useHistory()
  listenForUrlLanguage(history.location.pathname);

  return (
    <div className="App">
      <NavBar />
      <CookieBanner />
      <Switch>
        <Route path="/:language/About">
          <About />
        </Route>
        <Route path="/:language/Explore">
          <Explore />
        </Route>
        <Route path="/:language/Dashboard">
          <Redirect to="/:language/Explore" />
        </Route>
        <Route path="/:language/Analyze">
          <TableauEmbed
            url={ANALYZE_URLS}
            key={`AnalyzeTableau${language}`}
            desktopOptions={{
              width: "80vw",
              height: "3200px"
            }}
            mobileOptions={{
              width: "90vw",
              height: "2900px"
            }}
          />
        </Route>
        <Route path="/:language/Canada">
          <TableauEmbed
            url={CANADA_URLS}
            key={`CanadianTableau${language}`}
            desktopOptions={{
              width: "80vw",
              height: "5050px"
            }}
            mobileOptions={{
              width: "90vw",
              height: "2800px"
            }}
          />
        </Route>
        <Route path="/:language/Data">
          <Data />
        </Route>
        <Route path="/:language/PrivacyPolicy">
          <PrivacyPolicy />
        </Route>
        <Route path="/:language/CookiePolicy">
          <CookiePolicy />
        </Route>
        <Route path="/:language/TermsOfUse">
          <TermsOfUse />
        </Route>
        <Route path="/:language/Publications">
          <Publications />
        </Route>
        <Route path="/:language/Unity">
          <Explore initialFilters={(() => {
            let initialFilters = getEmptyFilters();
            initialFilters.unity_aligned_only = true;
            return initialFilters;
          })()}/>
        </Route>
        <Redirect exact from="/" to={`/${language}/Explore`} />
        {language && ["About", "Explore", "Analyze", "Data", "PrivacyPolicy", "CookiePolicy", "TermsOfUse", "Publications", "Canada"].map(route =>
          <Redirect from={`/${route}`} to={`${language}/${route}`}></Redirect>)}
        <Route>
          <NotFoundPage/>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;