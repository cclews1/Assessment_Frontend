import React, { useEffect, useState } from 'react';
import {
  AppBar,
  TextField,
  Box,
  Button,
  Toolbar,
  Typography,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Fab,
} from '@material-ui/core';
import qs from 'qs';
import { Delete, ThumbUp, DoubleArrow } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    paddingTop: '1rem',
  },
  root: {
    marginBottom: '0.5rem',
    width: '20rem',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  formContainer: {
    width: '20rem',
    maxWidth: '100%',
    marginBottom: '1rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  },
  form: {
    width: '100%',
  },
});

function Post({ postData, getPosts }) {
  const classes = useStyles();

  const [liked, setLiked] = useState(false);

  let likeCount = postData.likes + liked;

  async function handleLike() {
    if (!liked) {
      try {
        const like = await axios({
          method: 'post',
          url: '/like',
          data: qs.stringify({
            id: postData.id,
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });
        setLiked(!liked);
      } catch (err) {
        alert(err.message);
      }
    } else {
      try {
        const like = await axios({
          method: 'post',
          url: '/unlike',
          data: qs.stringify({
            id: postData.id,
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });
        setLiked(!liked);
      } catch (err) {
        alert(err.message);
      }
    }
  }

  async function handleDelete() {
    try {
      const removed = await axios({
        method: 'delete',
        url: '/remove',
        data: qs.stringify({
          id: postData.id,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });
      alert(removed.data.message);
      getPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <Card className={classes.root}>
      <CardContent className={classes.comment}>
        <Typography>{postData.content}</Typography>
      </CardContent>
      <CardActions>
        <div className={classes.buttonWrapper}>
          <Button
            color='primary'
            variant={liked ? 'contained' : 'default'}
            size='small'
            endIcon={<ThumbUp />}
            onClick={handleLike}
          >
            {likeCount
              ? `${likeCount} Like${likeCount === 1 ? '' : 's'}`
              : 'Like'}
          </Button>
          <IconButton aria-label='delete post' onClick={handleDelete}>
            <Delete />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}
function App() {
  const classes = useStyles();

  const [form, setForm] = useState();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  const getPosts = async () => {
    const posts = await axios.get('/posts').then((res) => {
      if (res.status === 500) {
        setError(res.error);
      } else {
        console.log(res.data);
        setPosts(res.data.posts);
      }
    });
    console.log(posts);
  };

  useEffect(() => {
    getPosts();
  }, []);

  async function submitPost() {
    try {
      if (form.length) {
        const post = await axios({
          method: 'post',
          url: '/posts',
          data: qs.stringify({
            content: form,
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });
        setForm('');
        getPosts();
      } else {
        throw new Error('You must put something in your post!');
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className='App'>
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant='h6'>FINBACK670 Takehome</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        <Card className={classes.formContainer}>
          <TextField
            className={classes.form}
            label='Enter your post here!'
            value={form}
            multiline
            onChange={(e) => setForm(e.target.value)}
          />
          <CardActions>
            <Button
              variant='contained'
              className={classes.submit}
              color='primary'
              onClick={submitPost}
              endIcon={<DoubleArrow />}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
        {posts
          ? posts.map((post) => {
              return <Post postData={post} getPosts={getPosts} />;
            })
          : null}
      </div>
    </div>
  );
}

export default App;
