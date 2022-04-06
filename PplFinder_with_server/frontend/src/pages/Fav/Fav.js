import React from "react";
import Text from "components/Text";
import FavList from "components/FavList";
import * as S from "./style";

const Fav = () => {
  return (
    <S.Home>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            Favorite Users
          </Text>
        </S.Header>
        <FavList  />
      </S.Content>
    </S.Home>
  );
};

export default Fav;
