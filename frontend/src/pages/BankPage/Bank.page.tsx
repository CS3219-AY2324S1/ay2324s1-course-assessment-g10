import React, { useEffect, useState } from "react";
import { QnTable } from "../../components/QnTable/QnTable.component";
import { FilterBar } from "../../components/QnFilter/QnFilter.component";
import { DifficultyFilter } from "../../components/QnFilter/DifficultyFilter.component";
import { VStack, useToast, Box, HStack } from "@chakra-ui/react";
import { QnFilter, Question } from "../../models/Question.model";
import { loadQuestions } from "../../data/sampleqn";
import { useDispatch, useSelector } from "react-redux";
import { selectFilteredQuestions, setQuestions } from "../../reducers/questionsSlice";
import { RootState } from "../../reducers/store";
import { fetchAllQuestions } from "../../api/questions";

const BankPage = () => {
  const [filter, setFilter] = useState<QnFilter>({});
  const [difficultyFilter, setDifficultyFilter] = useState<[number, number]>([0, 10]);
  const filteredQns = useSelector((state: RootState) => selectFilteredQuestions(state, { ...filter, difficultyFilter }));
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    console.log('fetching...')
    
    if (process.env.REACT_APP_ENV_TYPE !== 'prod') {
      loadQuestions();
    } else {      
      fetchAllQuestions().then((questions : Question[]) => {
        dispatch(setQuestions(questions));
      }).catch((err) => {
        console.log(err.message);
        toast({
          title: 'Error',
          description: err.message,
          status: 'error'
        });
      });
    }
  }, []);

  return (
    <VStack spacing="3">
      <Box w="80%">
        <HStack spacing="2">
          <FilterBar
            qnFilter={filter.qnFilter}
            setFilter={(newFilter) => setFilter(newFilter)}
          />
          <DifficultyFilter setDifficultyFilter={setDifficultyFilter} />
        </HStack>
      </Box>
      <QnTable filteredQn={filteredQns} pageSize={7}></QnTable>
    </VStack>
  );
};

export default BankPage;
