<template>
  <div class="content">
    <div class="transcripts">
      <div class="actualTrancript">
        <label for="actualTransId">Actual Transcript</label>
        <div>
          <textarea id="actualTransId" rows="10" cols="60" v-model="actual"> </textarea>
        </div>
      </div>
      <div class="generatedTranscript">
        <label for="genTransId">Generated Transcript</label>
        <div>
          <textarea id="genTransId" rows="10" cols="60" v-model="generated"> </textarea>
        </div>
      </div>
    </div>
    <div class="btn-section">
      <button
        type="button"
        class="btn btn-secondary btn-lg submitBtn"
        :disabled="isDisabled"
        v-on:click="submit"
      >
        Compare Transcript
      </button>

      <button
        type="button"
        class="btn btn-secondary btn-lg resetBtn"
        :disabled="isDisabled"
        v-on:click="reset"
      >
        Reset
      </button>
    </div>
    <div class="results-section" v-if="show">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="initialTab === 'results' && 'active'"
            data-toggle="tab"
            v-on:click="switchTabs('results')"
            >Results</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="initialTab === 'details' && 'active'"
            data-toggle="tab"
            v-on:click="switchTabs('details')"
            >Details</a
          >
        </li>
      </ul>
      <div id="myTabContent" class="tab-content">
        <div class="tab-pane fade active show">
          <div v-if="initialTab === 'results'">
            <p>Incorrect Words = {{ results.incorrectWords.length }}</p>
            <p>Missed words = {{ results.missedWords.length }}</p>
            <p>Accuracy = {{ results.accuracy }}%</p>
          </div>
          <div v-else>
            <p>Incorrect Words = {{ results.incorrectWords }}</p>
            <p>Missed words = {{ results.missedWords }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import core from '../lib/tellAccuracy';

export default {
  name: 'Content',
  data() {
    return {
      actual: '',
      generated: '',
      results: null,
      show: false,
      initialTab: 'results'
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();
      this.results = core.computeAccuracy(this.actual, this.generated);
      this.show = true;
    },
    reset(event) {
      event.preventDefault();
      this.actual = '';
      this.generated = '';
      this.results = null;
      this.show = false;
      this.initialTab = 'results';
    },
    switchTabs(tabName) {
      this.initialTab = tabName;
    }
  },
  computed: {
    isDisabled() {
      return !(this.actual.length > 0 && this.generated.length > 0);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  margin-left: 6rem;
}

.transcripts {
  display: flex;
  flex-direction: row;
}

.transcripts > div {
  flex: 1 1 auto;
}

.btn-section {
  display: flex;
}

.resetBtn {
  margin-left: 2rem;
}

.results-section {
  margin: 5px;
}

.nav-link {
  cursor: pointer;
}

p {
  margin-left: 8rem;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
