import { Button, IconButton, HStack } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export type PaginatorProps = {
  page: number;
  totalPages: number;
  adjacent: number;
  onPageChange: (x: number) => void;
};

export const Paginator = (pp: PaginatorProps) => {
  const { page, totalPages, adjacent, onPageChange } = pp;
  const next = () => {
    if (page === totalPages) return;
    onPageChange(page + 1);
  };

  const prev = () => {
    if (page === 1) return;
    onPageChange(page - 1);
  };

  const renderButton = (p: number) => {
    if (p < 0) {
      return (
        <Button colorScheme="blue" variant="" isDisabled>
          ...
        </Button>
      );
    }

    return (
      <Button
        colorScheme="blue"
        key={p}
        variant={p === page ? "solid" : "ghost"}
        isDisabled={p === page}
        onClick={() => onPageChange(p)}
      >
        {p}
      </Button>
    );
  };

  let from: number = Math.max(page - adjacent, 1);
  let to: number = Math.min(page + adjacent, totalPages);
  const btns: number[] = from !== 1 ? [1] : [];
  if (from > 2) {
    btns.push(-1);
  }
  for (let i = from; i <= to; i++) btns.push(i);
  if (to < totalPages - 1) {
    btns.push(-1);
  }
  if (to < totalPages) {
    btns.push(totalPages);
  }

  return (
    <div>
      <HStack
        spacing="4px"
        width="fit-content"
        backgroundColor="white"
        borderRadius="10"
        boxShadow="base"
        transition="box-shadow 0.2s"
        _hover={{
          boxShadow: "md",
        }}
      >
        <IconButton
          colorScheme="blue"
          variant="ghost"
          aria-label="Previous Page"
          icon={<ArrowBackIcon />}
          onClick={prev}
          isDisabled={page === 1}
        />
        {btns.map((page) => renderButton(page))}
        <IconButton
          colorScheme="blue"
          variant="ghost"
          aria-label="Next Page"
          icon={<ArrowForwardIcon />}
          onClick={next}
          isDisabled={page === totalPages}
        />
      </HStack>
    </div>
  );
};
