<template>
    <button class="btn" @click="starttimer">Start</button>
    <button class="btn" @click="stoptimer">Stop</button>

</template>

<script>

export default {
    name: 'Button',
    props: {
        text: String,
        label: String,
    },
    
    methods: {
        updatelabel(label){
          console.log(label);
            if(label === 'Work In Progress'){
                console.log('Good so far');
                
            }
            else if(label === 'Completed'){
              console.log('Good so far 2');
              
            }
        },
        starttimer(){
          console.log('aye yo')
        },

        stoptimer(){
          console.log('aye yo yo')
        }
      }
      
    };

    
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 500px;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
}

.btn {
  display: inline-block;
  background: #b9b9b9;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
  float: right;
}

.btn:focus {
  outline: none;
}

.btn:active {
  transform: scale(0.98);
}

.btn-block {
  display: block;
  width: 100%;
}
</style>