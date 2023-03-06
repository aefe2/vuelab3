let eventBus = new Vue();

Vue.component('container', {
    data() {
        return {
            firstCol: [],
            secondCol: [],
            thirdCol: [],
        }
    },
    methods: {
        save() {
            localStorage.firstCol = JSON.stringify(this.firstCol)
            localStorage.secondCol = JSON.stringify(this.secondCol)
            localStorage.thirdCol = JSON.stringify(this.thirdCol)
        },
        time(idNote) {
            let timeData = new Date();
            this.secondCol[idNote].time = timeData.getHours() + ':' + timeData.getMinutes();
            this.secondCol[idNote].date = timeData.getDate() + '.' + timeData.getMonth() + '.' + timeData.getFullYear();
        },
    },
    mounted() {
        if (localStorage.firstCol) {
            this.firstCol = JSON.parse(localStorage.firstCol)
        }
        if (localStorage.secondCol) {
            this.secondCol = JSON.parse(localStorage.secondCol)
        }
        if (localStorage.thirdCol) {
            this.thirdCol = JSON.parse(localStorage.thirdCol)
        }
        eventBus.$on('move-column2', (idNote, note) => {
            if (this.secondCol.length < 5) {
                if (this.firstCol[idNote].doneNum >= 50) {
                    this.secondCol.push(this.firstCol[idNote])
                    this.firstCol.splice(idNote, 1)
                    this.save()
                }
            }
            // } else if (this.secondCol.length === 5) {
            //
            // }
        });
        eventBus.$on('move-column3', (idNote, note) => {
            if (this.secondCol[idNote].doneNum === 100) {
                this.time(idNote)
                this.thirdCol.push(this.secondCol[idNote])
                this.secondCol.splice(idNote, 1)
                this.save()
            }
        })
    },
    template: `
    <div>
        <create-form></create-form>
        <div class="container">
            <column1 :class="{ disabled: secondCol.length === 5 }" class="column column1" :firstCol="firstCol"></column1>
            <column2 class="column column2" :secondCol="secondCol"></column2>
            <column3 class="column column3" :thirdCol="thirdCol"></column3>
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
            if (this.firstCol.length < 3) {
                this.firstCol.push(createNote)
                this.save()
            }
        })
    },
    methods: {
        save() {
            localStorage.firstCol = JSON.stringify(this.firstCol)
        },
    },
    template: `
     <div>
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
        save() {
            localStorage.secondCol = JSON.stringify(this.secondCol)
        }
    },
    template: `
     <div>
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
        save() {
            localStorage.thirdCol = JSON.stringify(this.thirdCol)
        }
    },
    template: `
     <div>
        <note v-for="(note, index) in thirdCol" @save="save()" :thirdCol="thirdCol" :key="note.key" :idNote="index" :note="note">
            
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
    },
    data() {
        return {
            taskTitle: null,
            isDone: false,
            doneNum: 0
        }
    },
    methods: {
        addTask() {
            if (this.taskTitle && this.note.tasks.length < 5) {
                let createTask = {
                    taskTitle: this.taskTitle,
                    isDone: false
                }
                this.note.tasks.push(createTask);
                this.taskTitle = '';
                this.$emit('save')
            }
        },
    },
    mounted() {
        eventBus.$on('update-checkbox', idNote => {
            let doneCount = 0;
            let notDoneCount = 0;
            let allTasksCount = 0;
            for (let task of this.note.tasks) {
                allTasksCount++;
                if (task.isDone === true) {
                    doneCount++;
                } else {
                    notDoneCount++;
                }
            }
            this.note.doneNum = (doneCount / (doneCount + notDoneCount)) * 100;
            if (this.note.doneNum > 50) eventBus.$emit('move-column2', idNote, this.note);
            if (this.note.doneNum === 100) eventBus.$emit('move-column3', idNote, this.note);
        })
    },
    template: `
    <div class="todo-card todo-item">
        <div class="todo-title">
            <span>{{ note.title }}</span>
        </div>
        <task v-for="(task, key) in note.tasks" :key="key" :task="task" :idNote="idNote"></task>
        <form class="add-task-form" v-show="this.note.tasks.length < 5 && this.note.doneNum !== 100" @submit.prevent="addTask">
            <input class="task-title-input" placeholder="new task" v-model="taskTitle" type="text">
            <input class="submit-btn" type="submit" value="+">
        </form>
        <div class="date" v-if="note.date">
            <span>Date - {{ note.date }}</span>
            <span>Time - {{ note.time }}</span>
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

Vue.component('create-form', {
    data() {
        return {
            title: null,
            taskTitle1: null,
            taskTitle2: null,
            taskTitle3: null,
            isDone: null,
            status: 0,
        };
    },
    methods: {
        onSubmit() {
            if (this.title && this.taskTitle1 && this.taskTitle2 && this.taskTitle3) {
                let createNote = {
                    title: this.title,
                    tasks: [
                        {
                            taskTitle: this.taskTitle1,
                            isDone: false
                        },
                        {
                            taskTitle: this.taskTitle2,
                            isDone: false
                        },
                        {
                            taskTitle: this.taskTitle3,
                            isDone: false
                        },
                    ],
                    status: 1,
                }
                eventBus.$emit('on-submit', createNote);
                this.title = '';
                this.taskTitle1 = '';
                this.taskTitle2 = '';
                this.taskTitle3 = '';
            }
        },
    },
    template: `
    <form class="create-form" @submit.prevent="onSubmit">
        <label>Create Todo</label>
        <input v-model="title" type="text" placeholder="title">
        <input v-model="taskTitle1" type="text" placeholder="task - 1">
        <input v-model="taskTitle2" type="text" placeholder="task - 2">
        <input v-model="taskTitle3" type="text" placeholder="task - 3">
        <input type="submit" value="Create">
    </form>
    `,
})


let app = new Vue({
    el: '#app',
    data: {},
})