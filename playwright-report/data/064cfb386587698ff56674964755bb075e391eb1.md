# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - button "Back" [ref=e6] [cursor=pointer]:
        - img
        - text: Back
      - heading "Create New Post" [level=1] [ref=e7]
  - generic [ref=e9]:
    - generic [ref=e10]:
      - generic [ref=e11]: Title *
      - textbox "Title *" [active] [ref=e12]:
        - /placeholder: Enter post title (max 80 characters)
        - text: "중요 공지 #1"
    - generic [ref=e13]:
      - generic [ref=e14]: Category *
      - combobox [ref=e15] [cursor=pointer]:
        - generic: Free
        - img [ref=e16]
      - combobox [ref=e18]
    - generic [ref=e19]:
      - text: Tags (comma-separated, max 5)
      - textbox "Tags (comma-separated, max 5)" [ref=e20]:
        - /placeholder: e.g., react, typescript, tutorial
      - paragraph [ref=e21]: Separate tags with commas. Maximum 5 tags.
    - generic [ref=e22]:
      - generic [ref=e23]: Content *
      - textbox "Content *" [ref=e24]:
        - /placeholder: Enter post content (max 2000 characters)
    - generic [ref=e25]:
      - button "Create Post" [ref=e26] [cursor=pointer]
      - button "Cancel" [ref=e27] [cursor=pointer]
```