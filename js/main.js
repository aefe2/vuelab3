let eventBus = new Vue();

Vue.component('container', {
    data() {
        return {
            firstCol: [],
            secondCol: [],
            thirdCol: [],
            fourthCol: []
        }
    },
    methods: {
        // save() {
        //     localStorage.firstCol = JSON.stringify(this.firstCol)
        //     localStorage.secondCol = JSON.stringify(this.secondCol)
        //     localStorage.thirdCol = JSON.stringify(this.thirdCol)
        // },
        // time(idNote) {
        //     let timeData = new Date();
        //     this.secondCol[idNote].time = timeData.getHours() + ':' + timeData.getMinutes();
        //     this.secondCol[idNote].date = timeData.getDate() + '.' + timeData.getMonth() + '.' + timeData.getFullYear();
        // },
    },
    mounted() {
        eventBus.$on('move-note-to-next-col', (idNote, buffStatus) => {
            if (buffStatus === 1) {
                this.secondCol.push(this.firstCol[idNote])
                this.firstCol.splice(idNote, 1)
            } else if (buffStatus === 2) {
                this.thirdCol.push(this.secondCol[idNote])
                this.secondCol.splice(idNote, 1)
            } else if (buffStatus === 3) {
                this.fourthCol.push(this.thirdCol[idNote])
                this.thirdCol.splice(idNote, 1)
            }
        });
        eventBus.$on('move-back', (idNote) => {
            this.secondCol.push(this.thirdCol[idNote])
            this.thirdCol.splice(idNote, 1)
        })
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
        //     // } else if (this.secondCol.length === 5) {
        //     //
        //     // }
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
            <column1 :class="{ disabled: secondCol.length === 5 }" class="column column1" :firstCol="firstCol"></column1>
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
    },
    data() {
        return {}
    },
    mounted() {
        eventBus.$on('on-submit', createNote => {
            this.firstCol.push(createNote)
            // this.save()
        });
        eventBus.$on('delete-note', idNote => {
            this.firstCol.splice(idNote, 1)
        })
    },
    methods: {
        // save() {
        //     localStorage.firstCol = JSON.stringify(this.firstCol)
        // },
    },
    template: `
     <div>
        <h4>Planned Tasks</h4>
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
        <h4>In Work</h4>
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
        <h4>Testing</h4>
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
        //     localStorage.secondCol = JSON.stringify(this.secondCol)
        // }
    },
    template: `
     <div>
        <h4>Done Tasks</h4>
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
        reason: {
            type: String
        }
    },
    data() {
        return {
            taskTitle: null,
            isDone: false,
            doneNum: 0,
            isReason: false
        }
    },
    methods: {
        deleteNote(idNote) {
            eventBus.$emit('delete-note', this.idNote)
        },
        moveNote(idNote) {
            let buffStatus = this.note.statusCol++
            eventBus.$emit('move-note-to-next-col', this.idNote, buffStatus)
        },
        moveBack(idNote) {
            this.isReason = true
        },
        reasonBack(idNote) {
            let buffStatus = this.note.statusCol--
            this.isReason = false
            eventBus.$emit('move-back', idNote, buffStatus)
        },
        editNote(idNote) {
            let buffStatus = this.note.statusCol;

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
        <div v-if="!isReason" class="reason">
            <span v-if="note.reason">{{ note.reason }}</span>
        </div>
        <div class="date" v-if="note.date">
            <span>Date - {{ note.date }}</span>
            <span>Time - {{ note.time }}</span>
        </div>
        <div class="deadline">
            <span>Date - {{ note.deadlineDate }}</span>
            <span>Time - {{ note.deadlineTime }}</span>
        </div>
        <div v-if="isReason" class="reason-input">
            <input type="text" v-model="note.reason" placeholder="return reason">
            <button @click="reasonBack(idNote)">Submit</button>
        </div>
        <div class="delete-block">
            <button v-if="note.statusCol === 1" @click="deleteNote(idNote)">Delete</button>
        </div>
        <div class="btns">
            <button v-if="note.statusCol !== 4 && !isReason" @click="moveNote(idNote)">Move</button>
            <button v-if="note.statusCol === 3" @click="moveBack(idNote)">Move back</button>
            <button v-if="note.statusCol !== 4" @click="editNote(idNote)">Edit</button>
        </div>
    </div>`,
})

Vue.component('task', {
    props: {
        task: {
            type: Object
        },
        idNote: {
            type: Number,
        },
    },
    data() {
        return {}
    },
    methods: {
        updateCounter() {
            this.task.isDone = !this.task.isDone
            eventBus.$emit('update-checkbox', this.idNote)
        }
    },
    mounted() {

    },
    template: `
    <div class="task">
        <span class="task-title">{{ task.taskTitle }}</span>
        <button :class="{done: task.isDone}" 
        class="done-btn"
        :disabled="task.isDone"
        @click="updateCounter()">Done</button>
<!--        <button v-show="task.isDone" -->
<!--        class="undone-btn"-->
<!--        @click="updateCounter()">Undone</button>-->
    </div>`,
})

Vue.component('edit', {
    props: {},
    methods: {},
    mounted() {
    },
    data() {
        return {
            title: null,
            taskTitle: null,
            editTime: null,
            editDate: null,
            deadlineDate: null,
            deadlineTime: null,
        }
    },
    template:`
    <form class="editForm" @submit.prevent="formEdit">
        <label>Title</label>
        <input type="text" placeholder="title">
        <label>Description</label>
        <input type="text" placeholder="description">
        <label>DeadLine</label>
        <input type="date">
        <input type="time">
        <input type="submit" value="Submit">
    </form>
    `
})

Vue.component('create-form', {
    data() {
        return {
            title: null,
            taskTitle: null,
            time: null,
            date: null,
            deadlineDate: null,
            deadlineTime: null,
            isDone: null,
            reason: null
        };
    },
    methods: {
        onSubmit() {
            if (this.title && this.taskTitle) {
                let DateTime = new Date()
                let createNote = {
                    title: this.title,
                    taskTitle: this.taskTitle,
                    time: DateTime.getHours() + ':' + DateTime.getMinutes(),
                    date: DateTime.getFullYear() + '-' + DateTime.getMonth() + '-' + DateTime.getDay(),
                    deadlineTime: this.deadlineTime,
                    deadlineDate: this.deadlineDate,
                    statusCol: 1,
                    reason: null
                }
                eventBus.$emit('on-submit', createNote);
                this.title = '';
                this.taskTitle = '';
                this.deadlineDate = null;
                this.deadlineTime = null;
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