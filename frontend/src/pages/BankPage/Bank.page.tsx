import React, { useEffect, useState } from "react";
import { QnTable } from "../../components/QnTable/QnTable.component";
import { FilterBar } from "../../components/QnFilter/QnFilter.component";
import { VStack } from "@chakra-ui/react";
import { QnFilter } from "../../models/Question.model";
import { loadQuestions } from "../../data/sampleqn";
import { useDispatch, useSelector } from "react-redux";
import { selectFilteredQuestions, setQuestions } from "../../reducers/questionsSlice";
import { RootState } from "../../reducers/store";
import { fetchAllQuestions } from "../../api/questions";

const BankPage = () => {
  const [filter, setFilter] = useState<QnFilter>({});
  const filteredQns = useSelector((state: RootState) =>selectFilteredQuestions(state, filter));
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('dispatching...')
    loadQuestions();
    fetchAllQuestions().then((res) => {
      const questions = res.data.questions;
      dispatch(setQuestions(questions));
    }).catch((err) => {
      console.log(err.msg);
    })
    // setTimeout(() => dispatch(setQuestions(dummyQn)), 3000) //simulating network fetch
  })

  return (
    <VStack spacing="3">
      <FilterBar setFilter={setFilter} />

      <QnTable filteredQn={filteredQns} pageSize={7}></QnTable>
    </VStack>
  );
};

export default BankPage;
