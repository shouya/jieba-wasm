const { new_jieba, cut, tag } = wasm_bindgen;

const DEBOUNCE_TIME = 100;

let jieba_instance = null;
let pending_task = null;

function get_input_arguments() {
  const input = document.getElementById("input").value;
  const cut_mode = document.querySelector(
    'input[name="cut-mode"]:checked',
  ).value;
  const hmm = document.getElementById("hmm").checked;
  const op_mode = document.querySelector('input[name="op-mode"]:checked').value;

  return [input, cut_mode, hmm, op_mode];
}

async function onload() {
  await wasm_bindgen("./jieba_wasm_bg.wasm");
  if (jieba_instance === null) {
    document.getElementById("output").innerHTML = "Initializing...";
    jieba_instance = new_jieba();
    document.getElementById("output").innerHTML = "";
  }
}

async function update() {
  // ensure the wasm module and jieba instance is loaded
  document.getElementById("output").innerHTML = "Pending...";
  await onload();

  clearTimeout(pending_task);
  pending_task = setTimeout(submit_update, DEBOUNCE_TIME);
}

function submit_update() {
  const [input, cut_mode, hmm, op_mode] = get_input_arguments();

  let output = undefined;

  if (op_mode == "cut") {
    output = cut(jieba_instance, input, cut_mode, hmm);
  } else if (op_mode == "tag") {
    output = tag(jieba_instance, input, hmm);
  }

  document.getElementById("output").innerHTML = output;
}

function switch_cut_mode(on) {
  const cut_mode_select = document.getElementById("cut-mode-select");
  const inputs = cut_mode_select.getElementsByTagName("input");
  for (const input of inputs) {
    input.disabled = !on;
  }
}

window.addEventListener("DOMContentLoaded", function () {
  setTimeout(update, 0);
});
