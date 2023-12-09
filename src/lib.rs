use jieba_rs::Jieba;
use wasm_bindgen::prelude::*;

use std::ops::Deref;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Debug)]
pub enum CutMode {
  Precise = "precise",
  Full = "full",
  Search = "search",
}

pub struct FullOutput {
  tokens: Vec<Token>,
}

impl FullOutput {
  fn render_html(self) -> String {
    let mut html = String::new();
    for (i, Token { token, pos }) in self.tokens.into_iter().enumerate() {
      // ensure that the token is printable
      let token = html_escape::encode_text(&token)
        .replace(" ", "&ensp;")
        .replace("\n", "\\n");

      let pos = pos.as_ref().map(html_escape::encode_text);
      let token_bg = if i % 2 == 0 { "#dbfbf3" } else { "#fbe7db" };
      let style = format!("background-color: {}", token_bg);
      let content = if let Some(pos) = pos {
        format!("<ruby>{}<rt>{}</rt></ruby>", token, pos)
      } else {
        token
      };

      let span = format!(
        "<span class=\"token\" style=\"{}\">{}</span>",
        style, content
      );
      html.push_str(&span);
    }
    html
  }
}

pub struct Token {
  token: String,
  pos: Option<String>,
}

impl From<&str> for Token {
  fn from(s: &str) -> Self {
    Token {
      token: s.to_string(),
      pos: None,
    }
  }
}

impl From<jieba_rs::Tag<'_>> for Token {
  fn from(tag: jieba_rs::Tag) -> Self {
    Token {
      token: tag.word.to_string(),
      pos: Some(tag.tag.to_string()),
    }
  }
}

#[wasm_bindgen]
pub struct JiebaInstance(Jieba);

impl Deref for JiebaInstance {
  type Target = Jieba;

  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

#[wasm_bindgen]
pub fn new_jieba() -> JiebaInstance {
  // will only be set up once
  console_error_panic_hook::set_once();
  JiebaInstance(Jieba::new())
}

#[wasm_bindgen]
pub fn cut(
  instance: &JiebaInstance,
  s: &str,
  mode: CutMode,
  hmm: bool,
) -> String {
  let tokens = match mode {
    CutMode::Precise => instance.cut(s, hmm),
    CutMode::Full => instance.cut_all(s),
    CutMode::Search => instance.cut_for_search(s, hmm),
    CutMode::__Nonexhaustive => panic!("invalid mode"),
  };

  let tokens = tokens.into_iter().map(Token::from).collect::<Vec<_>>();
  FullOutput { tokens }.render_html()
}

#[wasm_bindgen]
pub fn tag(instance: &JiebaInstance, s: &str, hmm: bool) -> String {
  let tokens = instance.tag(s, hmm);
  let tokens = tokens.into_iter().map(Token::from).collect::<Vec<_>>();
  FullOutput { tokens }.render_html()
}
