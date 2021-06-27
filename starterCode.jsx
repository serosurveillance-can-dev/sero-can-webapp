/* *** Task Description *** */

/*
Imagine we have a small React app that implements a table that 
displays a list of seroprevalence studies (data is stored in memory/context). 
Each study object contains a name, associated population group, and reported seroprevalence. 
Implement a population group filter that controls what is shown in the data table.

Notes:
- Code doesn't need to compile, focus on thought process & structure
- Feel free to use google/stack overflow, official docs for open source libs, and us as resources
*/

/* *** App.jsx *** */
import React, { useState } from "react";
import SomeTableComponent from SomeUILibrary;

const App = () => {
  const initialState = {
    studies = [
        {
          name: "study1",
          population_group: "healthcare workers",
          seroprevalence_reported: 0.4,
          country: "Canada",
          study_end_date: "2020-08-21",
          test_type: "LFIA"
        },
        {
          name: "study2",
          population_group: "general population",
          seroprevalence_reported: 0.2,
          country: "Canada",
          study_end_date: "2020-08-21",
          test_type: "LFIA"
        },
        {
          name: "study3",
          population_group: "healthcare workers",
          seroprevalence_reported: 0.5,
          country: "France",
          study_end_date: "2020-08-21",
          test_type: "ELISA"
        },
        {
          name: "study4",
          population_group: "persons experiencing homelessness",
          seroprevalence_reported: 0.6,
          country: "Zimbabwe",
          study_end_date: "2020-08-21",
          test_type: "ELISA"
        },
        {
          name: "study5",
          population_group: "general population",
          seroprevalence_reported: 0.3,
          country: "United States",
          study_end_date: "2020-08-21",
          test_type: "ELISA"
        }
    ]
  };

  // https://reactjs.org/docs/hooks-reference.html#usestate
  const [state, changeState] = useState(initialState);
  return (
      <SomeTableComponent data={state.studies}/>
  );
};

export default App;