import React, { useState } from "react";
import { QnTable } from "../../components/QnTable/QnTable.component";
import { FilterBar } from "../../components/QnFilter/QnFilter.component";
import { VStack } from "@chakra-ui/react";
import { QnFilter } from "../../models/Quesiton.model";
import { Question } from "../../models/Quesiton.model";
import { dummyQn } from "../../data/sampleqn";

const filterQn = (questions: Question[], filter: QnFilter) => {
  return questions.filter((qn) => {
    if (filter.difficultyFilter) {
      if (
        qn.difficulty > filter.difficultyFilter[1] ||
        qn.difficulty < filter.difficultyFilter[0]
      )
        return false;
    }

    if (filter.tagFilter && filter.tagFilter.size) {
      if (qn.categories.every((tag) => !filter.tagFilter?.has(tag))) {
        return false;
      }
    }

    if (filter.qnFilter) {
      if (qn.displayedQuestion.toLowerCase().indexOf(filter.qnFilter) === -1) {
        return false;
      }
    }

    return true;
  });
};

const BankPage = () => {
  const allQuestion = dummyQn;
  const [filter, changeFilter] = useState<QnFilter>({});
  const [filteredQn, setFilteredQn] = useState<Question[]>(
    filterQn(allQuestion, filter)
  );
  const onFilterChange = (newFilter: QnFilter) => {
    changeFilter(newFilter);
    setFilteredQn(filterQn(allQuestion, newFilter));
  };
  return (
    <VStack spacing="3">
      <FilterBar onFilterChange={onFilterChange} />

      <QnTable filteredQn={filteredQn} pageSize={7}></QnTable>
    </VStack>
  );
};

export default BankPage;
