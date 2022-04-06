import React, { useCallback, useEffect, useRef, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";
import useStickyState from "../../hooks/useStickyState";

const FavList = () => {
  const [hoveredUserId, setHoveredUserId] = useState();


  const [ favUserId,setFavUserId] = useStickyState({}, "fav_user_id");
  const [ favUserList,setFavUserList] = useStickyState([], "fav_user_list");

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };


  const removeFav = () => {  ///add user to fav list

    setFavUserList((old_user) => old_user.filter((user) => user.login.uuid !== favUserList[hoveredUserId].login.uuid))
    setFavUserId({ ...favUserId, [`${favUserList[hoveredUserId].login.uuid}`]: ![`${favUserList[hoveredUserId].login.uuid}`] })
  }


  return (
    <S.UserList>

      <S.List>
        {favUserList.map((user, index) => {
          return (
            <S.User
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}

            >
              <S.UserPicture src={user?.picture.large} alt="" />
              <S.UserInfo>
                <Text size="22px" bold>
                  {user?.name.title} {user?.name.first} {user?.name.last}
                </Text>
                <Text size="14px">{user?.email}</Text>
                <Text size="14px">
                  {user?.location.street.number} {user?.location.street.name}
                </Text>
                <Text size="14px">
                  {user?.location.city} {user?.location.country}
                </Text>
              </S.UserInfo>
              {
                favUserId[`${user.login.uuid}`] === true ? <S.IconButtonWrapper isVisible={true}>
                  <IconButton onClick={removeFav}>
                    <FavoriteIcon color="error" />
                  </IconButton>
                </S.IconButtonWrapper>
                  :
                  <S.IconButtonWrapper isVisible={index === hoveredUserId}>
                    <IconButton onClick={removeFav}>
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </S.IconButtonWrapper>
              }
            </S.User>

          );

        })}

      </S.List>
    </S.UserList >
  );
};

export default FavList;
