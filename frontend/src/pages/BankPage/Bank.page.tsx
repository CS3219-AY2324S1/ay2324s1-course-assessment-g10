import React, { useEffect, useState } from "react";
import { QnTable } from "../../components/QnTable/QnTable.component";
import { FilterBar } from "../../components/QnFilter/QnFilter.component";
import { VStack, useToast } from "@chakra-ui/react";
import { QnFilter } from "../../models/Question.model";
import { loadQuestions } from "../../data/sampleqn";
import { useDispatch, useSelector } from "react-redux";
import { selectFilteredQuestions, setQuestions } from "../../reducers/questionsSlice";
import { RootState } from "../../reducers/store";
import { fetchAllQuestions } from "../../api/questions";
import { AxiosResponse } from "axios";

const BankPage = () => {
  const [filter, setFilter] = useState<QnFilter>({});
  const filteredQns = useSelector((state: RootState) =>selectFilteredQuestions(state, filter));
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    console.log('fetching...')
    
    if (process.env.ENV_TYPE !== 'prod') {
      loadQuestions();
    } else {      
      fetchAllQuestions().then((res : AxiosResponse) => {
        const questions = res.data;
        dispatch(setQuestions(questions));
      }).catch((err) => {
        console.log(err.message);
        toast({
          title: 'Error',
          description: err.message,
          status: 'error'
        })
      })
    }
  })

  return (
    <VStack spacing="3">
      <FilterBar setFilter={setFilter} />

      <QnTable filteredQn={filteredQns} pageSize={7}></QnTable>
    </VStack>
  );
};

export default BankPage;
