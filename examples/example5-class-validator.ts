import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { XmlChildElem, xmlToClass } from '../src/index';

enum ArticleStatus {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived',
}

class Author {
  @IsString()
  @IsNotEmpty()
  @XmlChildElem({ type: () => String })
  Name: string;
}
class Comment {
  @IsString()
  @IsNotEmpty()
  @XmlChildElem({ type: () => String })
  Text: string;
}
class Article {
  @IsString()
  @IsNotEmpty()
  @XmlChildElem({ type: () => String })
  Title: string;

  @IsEnum(ArticleStatus)
  @XmlChildElem({ type: () => String })
  Status: ArticleStatus;

  @ValidateNested()
  @XmlChildElem({ type: () => Author })
  Author: Author;

  @ValidateNested({ each: true })
  @XmlChildElem({ name: 'Comment', type: () => Comment })
  Comments: Comment[];

  constructor(data?: Article) {
    Object.assign(this, data || {});
  }
}

const parsed = xmlToClass(
  `<?xml version="1.0" encoding="UTF-8"?>
          <Article>
            <Title>Some article title</Title>
            <Status>published</Status>
            <Author><Name>John Doe</Name></Author>
            <Comment><Text>Some comment</Text></Comment>
            <Comment><Text>Some other comment</Text></Comment>
          </Article>`,
  Article,
);
// class-validator can look up the constructor of
// the value and so it known what validation rules to apply
const noErrorsHere = validateSync(parsed);
console.log(noErrorsHere); // Output: []
// expect(valid).to.be.empty;

const parsedErr1 = xmlToClass(
  `<?xml version="1.0" encoding="UTF-8"?>
          <Article>
            <Title></Title><Status>unknownstatus-aboba</Status>
            <Author><Name>John Doe</Name></Author>
            <Comment><Text></Text></Comment>
            <Comment><Text>Some other comment</Text></Comment>
          </Article>`,
  Article,
);
const expErr = validateSync(parsedErr1);
console.log(expErr);
// assertClassValidator(expErr, 'Title', 'isNotEmpty');
// assertClassValidator(expErr, 'Status', 'isEnum');
// assertClassValidator(expErr, 'Comments.Text', 'isNotEmpty');
