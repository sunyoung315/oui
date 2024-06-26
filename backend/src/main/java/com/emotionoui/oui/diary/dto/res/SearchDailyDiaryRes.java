package com.emotionoui.oui.diary.dto.res;

import com.emotionoui.oui.diary.entity.DailyDiary;
import com.emotionoui.oui.diary.entity.DailyDiaryCollection;
import lombok.*;
import org.bson.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;


@Builder
@Getter
@ToString
@AllArgsConstructor
public class SearchDailyDiaryRes {

    // 몽고디비 일기 ID
    private String dailyDiaryId;
    // 일기 작성자 ID
    private Integer writerId;
    // 현재 멤버 ID
    private Integer memberId;
    // 다이어리 ID
    private Integer diaryId;
    // 일기 내용
    private String dailyContent;
    // 일기 꾸미기 내용
    private String decoration;
    // 일기 날짜
    private String dailyDate;

    public static SearchDailyDiaryRes of(DailyDiaryCollection collection, DailyDiary dailyDiary, Integer memberId) {
        return SearchDailyDiaryRes.builder()
                .dailyDiaryId(collection.getId().toString())
                .writerId(collection.getMemberId())
                .diaryId(collection.getDiaryId())
                .dailyContent(collection.getContent())
                .decoration(collection.getDecoration())
                .dailyDate(dailyDiary.getDailyDate().toString())
                .memberId(memberId)
                .build();
    }
}