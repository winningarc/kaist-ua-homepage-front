import React, { useCallback, useEffect } from "react";
import qs from "qs";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BoardContent from "../../templates/BoardContent";
import * as boardsAPI from "../../../lib/api/board";
import * as postsAPI from "../../../lib/api/post";
import { setBoards } from "../../../modules/boards";
import { listPosts } from "../../../modules/posts";

const BoardContentContainer = ({ location, boardId, history }) => {
  const dispatch = useDispatch();
  const { posts, boards } = useSelector(({ posts, boards }) => ({
    posts: posts.posts,
    boards: boards.boards
  }));

  const { author, korTitle, engTitle, page } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

  const redirect = useCallback(() => {
    if (!page) history.push(`${location.pathname}?page=1`);
  }, [page, history, location.pathname]);

  useEffect(() => {
    redirect();
  }, [location.pathname, boardId, redirect]);

  const getBoardsList = useCallback(() => {
    boardsAPI
      .list()
      .then(res1 => {
        dispatch(setBoards(res1.data));

        postsAPI
          .listPosts({ author, korTitle, engTitle, page, boardId })
          .then(res2 => {
            const { posts, lastPage } = res2.data;
            dispatch(listPosts({ posts, lastPage }));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, [dispatch, author, boardId, page, korTitle, engTitle]);

  useEffect(() => {
    getBoardsList();
  }, [dispatch, location.search, getBoardsList]);

  return <BoardContent boards={boards} boardId={boardId} posts={posts} />;
};

export default withRouter(BoardContentContainer);
