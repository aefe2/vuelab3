let eventBus = new Vue();

Vue.component('container', {
    data() {
        return {
            columns: [[], [], [], []],
            isEdit: false,
        }
    },
    methods: {
        // save() {
        //     localStorage.firstCol = JSON.stringify(this.firstCol)
        //     localStorage.secondCol = JSON.stringify(this.secondCol)
        //     localStorage.thirdCol = JSON.stringify(this.thirdCol)
        // },
    },
    //card-note
    mounted() {
        eventBus.$on('note-submitted', createdNote => {
            this.columns[0].push(createdNote);
        });
        // eventBus.$on('delete-note', (idCol, idNote) => {
        //     this.columns[idCol].splice(idNote, 1)
        // });
        // if (localStorage.firstCol) {
        //     this.firstCol = JSON.parse(localStorage.firstCol)
        // }
        // if (localStorage.secondCol) {
        //     this.secondCol = JSON.parse(localStorage.secondCol)
        // }
        // if (localStorage.thirdCol) {
        //     this.thirdCol = JSON.parse(localStorage.thirdCol)
        // }
        // eventBus.$on('move-column2', (idNote, note) => {
        //     if (this.secondCol.length < 5) {
        //         if (this.firstCol[idNote].doneNum >= 50) {
        //             this.secondCol.push(this.firstCol[idNote])
        //             this.firstCol.splice(idNote, 1)
        //             this.save()
        //         }
        //     }
        // } else if (this.secondCol.length === 5) {
        //
        // }
        // });
        // eventBus.$on('move-column3', (idNote, note) => {
        //     if (this.secondCol[idNote].doneNum === 100) {
        //         this.time(idNote)
        //         this.thirdCol.push(this.secondCol[idNote])
        //         this.secondCol.splice(idNote, 1)
        //         this.save()
        //     }
        // })
    },
    template: `
    <div>
        <create-form></create-form>
        <div class="container">
            <column1 class="column column1" :firstCol="firstCol"></column1>
            <column2 class="column column2" :secondCol="secondCol"></column2>
            <column3 class="column column3" :thirdCol="thirdCol"></column3>
            <column4 class="column column4" :fourthCol="fourthCol"></column4>
        </div>
    </div>
    `,
})

Vue.component('column1', {
    props: {
        firstCol: {
            type: Array,
            required: true
        },
        idCol: {
            type: Number
        }
    },
    data() {
        return {}
    },
    mounted() {
        eventBus.$on('on-submit', createNote => {
            this.firstCol.push(createNote)
            // this.save()
            // }
        })
    },
    methods: {
        // save() {
        //     localStorage.firstCol = JSON.stringify(this.firstCol)
        // },
    },
    template: `
     <div>
        <h2>Scheduled tasks</h2>
        <note v-for="(note, index) in firstCol" @save="save()" :firstCol="firstCol" :key="note.key" :idNote="index" :note="note">
            
        </note>
    </div>
    `,
})

Vue.component('column2', {
    props: {
        secondCol: {
            type: Array,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        // save() {
        //     localStorage.secondCol = JSON.stringify(this.secondCol)
        // }
    },
    template: `
     <div>
        <h2>Tasks at work</h2>
        <note v-for="(note, index) in secondCol" @save="save()" :secondCol="secondCol" :key="note.key" :idNote="index" :note="note">
            
        </note>
    </div>
    `,
})

Vue.component('column3', {
    props: {
        thirdCol: {
            type: Array,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        // save() {
        //     localStorage.thirdCol = JSON.stringify(this.thirdCol)
        // }
    },
    template: `
     <div>
        <h2>Testing</h2>
        <note v-for="(note, index) in thirdCol" @save="save()" :thirdCol="thirdCol" :key="note.key" :idNote="index" :note="note">
            
        </note>
    </div>
    `,
})

Vue.component('column4', {
    props: {
        fourthCol: {
            type: Array,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        // save() {
        //     localStorage.thirdCol = JSON.stringify(this.thirdCol)
        // }
    },
    template: `
     <div>
        <h2>Completed tasks</h2>
        <note v-for="(note, index) in fourthCol" @save="save()" :fourthCol="fourthCol" :key="note.key" :idNote="index" :note="note">
            
        </note>
    </div>
    `,
})

Vue.component('note', {
    props: {
        note: {
            type: Object,
        },
        idNote: {
            type: Number,
        },
        idCol: {
            type: Number
        }
    },
    data() {
        return {
            taskTitle: null,
            isDone: false,
            doneNum: 0
        }
    },
    methods: {
        deleteNote(idNote) {
            eventBus.$emit('delete-note', idNote)
        }
    },
    mounted() {

    },
    template: `
    <div class="todo-card todo-item">
        <div class="todo-title">
            <span>{{ note.title }}</span>
        </div>
        <div>
            <span>{{ note.taskTitle }}</span>
        </div>
        <div class="date" v-if="note.date">
            <span>Date - {{ note.date }}</span>
            <span>Time - {{ note.time }}</span>
        </div>
        <div class="deadline">
            <span>Date - {{ note.deadlineDate }}</span>
            <span>Time - {{ note.deadlineTime }}</span>
        </div>
        <div class="delete-block">
            <button @click="deleteNote(idNote)">Delete</button>
        </div>
    </div>`,
})

Vue.component('edit-note', {
    props: {},
    data() {
        return {}
    },
    methods: {},
    mounted() {
    },
    template: `
        
    `,
})

Vue.component('create-form', {
    data() {
        return {
            title: null,
            taskTitle: null,
            date: null,
            time: null,
            deadlineDate: null,
            deadlineTime: null
        };
    },
    methods: {
        onSubmit() {
            if (this.title && this.taskTitle) {
                let timeData = new Date();
                let createNote = {
                    title: this.title,
                    taskTitle: this.taskTitle,
                    time: timeData.getHours() + ':' + timeData.getMinutes(),
                    date: timeData.getFullYear() + '-' + Number(timeData.getMonth() + 1) + '-' + timeData.getDate(),
                    deadlineDate: this.deadlineDate,
                    deadlineTime: this.deadlineTime
                }
                eventBus.$emit('on-submit', createNote);
                this.title = '';
                this.taskTitle = '';
            }
        },
    },
    template: `
    <form class="create-form" @submit.prevent="onSubmit">
        <label>Create Todo</label>
        <input v-model="title" type="text" placeholder="title">
        <input v-model="taskTitle" type="text" placeholder="description">
        <span>Deadline</span>
        <div class="date-input">
            <input type="date" v-model="deadlineDate">
            <input type="time" v-model="deadlineTime">
        </div>
        <input type="submit" value="Create">
    </form>
    `,
})


let app = new Vue({
    el: '#app',
    data: {},
})