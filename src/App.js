import React, { useEffect, useState } from 'react';
import {
  AppBar,
  TextField,
  Button,
  Toolbar,
  Typography,
  Card,
  CardActions,
  CardContent,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    paddingTop: '1rem',
  },
  root: {
    marginBottom: '0.5rem',
    minWidth: '20rem',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});

function Post({ postData }) {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.comment}>
        <Typography>{postData.content}</Typography>
      </CardContent>
      <CardActions>
        <div className={classes.buttonWrapper}>
          <Button size='small' endIcon={<Delete />}>
            {postData.likes ? `${postData.likes} Likes` : 'Like'}
          </Button>
          <IconButton aria-label='delete post'>
            <Delete />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}
function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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
    getPosts();
  }, []);

  return (
    <div className='App'>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>FINBACK670 Takehome</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        {posts
          ? posts.map((post) => {
              return <Post postData={post} />;
            })
          : null}
      </div>
    </div>
  );
}

export default App;
