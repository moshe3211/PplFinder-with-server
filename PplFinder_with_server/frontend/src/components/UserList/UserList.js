import React, { useCallback, useEffect, useRef, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";
import useStickyState from "../../hooks/useStickyState";

const UserList = ({ users, isLoading, fetchUsers }) => {
  const [hoveredUserId, setHoveredUserId] = useState();
  const [pageNo, setPageNo] = useState(1)
  const [countryList, setCountryList] = useState("")
  const [ favUserId,setFavUserId] = useStickyState({}, "fav_user_id");
  const [ favUserList,setFavUserList] = useStickyState([], "fav_user_list");
  const [checkedCountry, setCheckedCoutnry] = useState({ BR: false,AU: false,CA: false,DE: false,DK:false})
  const observer = useRef()


  useEffect(() => { ///filter table for country checkbox
    const country = Object.entries(checkedCountry)
    let country_list = []
    for (const c of country) {
      if (c[1] === true) {
        country_list.push(c[0])
      }
    }
    country_list = country_list.join()
    setCountryList(country_list)
    fetchUsers(country_list, 1, true)
    setPageNo(1)
  }, [checkedCountry])


  useEffect(() => { // for page no change
    if (pageNo !== 1) {
      fetchUsers(countryList, pageNo, false)
    }
  }, [pageNo])

  const lastUserRef = useCallback((node) => { ///handle scroll
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPageNo(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading])

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };


  const onChangeCheckbox = (value, isChecked) => {
    setCheckedCoutnry({ ...checkedCountry, [`${value}`]: !isChecked })
  }

  const addToFav = () => {  ///add user to fav list
    if (favUserId[`${users[hoveredUserId].login.uuid}`]) { 
      if(favUserId[`${users[hoveredUserId].login.uuid}`]==true){                          //if its already added remove it from the list
        setFavUserList((old_user) => old_user.filter((user) => user.login.uuid !== users[hoveredUserId].login.uuid))
      }else{
        setFavUserList((old_user)=>[...old_user,users[hoveredUserId]])
      }
      setFavUserId({ ...favUserId, [`${users[hoveredUserId].login.uuid}`]: ![`${users[hoveredUserId].login.uuid}`] })
    } else {
      setFavUserId({ ...favUserId, [`${users[hoveredUserId].login.uuid}`]: true })
      setFavUserList((old_user)=>[...old_user,users[hoveredUserId]])
    }

  }


  return (
    <S.UserList>
      <S.Filters>
        <CheckBox value="BR" label="Brazil" onChange={onChangeCheckbox} isChecked={checkedCountry.BR} />
        <CheckBox value="AU" label="Australia" onChange={onChangeCheckbox} isChecked={checkedCountry.AU} />
        <CheckBox value="CA" label="Canada" onChange={onChangeCheckbox} isChecked={checkedCountry.CA} />
        <CheckBox value="DE" label="Germany" onChange={onChangeCheckbox} isChecked={checkedCountry.DE} />
        <CheckBox value="DK" label="Denmark" onChange={onChangeCheckbox} isChecked={checkedCountry.DK} />
      </S.Filters>
      <S.List>
        {users.map((user, index) => {
          return (
            <S.User
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              ref={users.length === index + 1 ? lastUserRef : null}
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
                  <IconButton onClick={addToFav}>
                    <FavoriteIcon color="error" />
                  </IconButton>
                </S.IconButtonWrapper>
                  :
                  <S.IconButtonWrapper isVisible={index === hoveredUserId}>
                    <IconButton onClick={addToFav}>
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </S.IconButtonWrapper>
              }
            </S.User>

          );

        })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList >
  );
};

export default UserList;
