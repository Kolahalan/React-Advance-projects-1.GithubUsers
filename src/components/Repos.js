import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);
  console.log(repos);

  //We are using repos.reduce(()=>{callback func},{}) to iterate the repos array,
  //collect the data that we need and create a new array named 'languages' in our own sub fields

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item; //These values are coming from repos Array
    if (!language) {
      return total; //At times, the language field comes as null, at that time, we just return total
    }
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }

    return total;
  }, {});
  console.log(languages);

  //Most used languages
  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      //sorting array from highest to lowest with respect to value field type
      return b.value - a.value;
    })
    .slice(0, 5); //restricting the array ]to a length of 5

  // most stars per language
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      //sorting array from highest to lowest with respect to stars field type

      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
      //We are doing this map iteration so that we get the data in a {label: ,value: }
      //format which is the way it should be sent to the chart
    })
    .slice(0, 5); //restricting the array ]to a length of 5

  //The chart data for fusion charts need to in the format of label and value
  // Sample chartdata for Fusion Charts
  //  const chartdata = [
  //   {
  //     label: "HTML",
  //     value: "13",
  //   },
  //   {
  //     label: "CSS",
  //     value: "27",
  //   },
  //   {
  //     label: "Javascript",
  //     value: "60",
  //   },
  // ];
  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartdata} />; */}
        <Pie3D data={mostUsed} />
        <div></div>
        <Doughnut2D data={mostPopular} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
