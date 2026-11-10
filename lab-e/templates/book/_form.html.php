<?php
/** @var $book ?\App\Model\Book */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="book[title]" value="<?=$book ? $book->getTitle(): ''?>" required>
</div>

<div class="form-group">
    <label for="author">Author</label>
    <input type="text" id="author" name="book[author]" value="<?=$book ? $book->getAuthor(): ''?>" required>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
