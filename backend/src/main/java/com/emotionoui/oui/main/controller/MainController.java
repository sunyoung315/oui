package com.emotionoui.oui.main.controller;

import com.emotionoui.oui.main.dto.req.CreateShareDiaryReq;
import com.emotionoui.oui.main.dto.res.SearchDiaryListRes;
import com.emotionoui.oui.main.service.MainService;
import com.emotionoui.oui.member.entity.Member;
import com.emotionoui.oui.querydsl.DiaryRepositoryCustom;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
public class MainController {

    private final DiaryRepositoryCustom diaryRepositoryCustom;
    private final MainService mainService;
    /**
     * 모든 다이어리 가져오기
     *
     * @param member
     * @return
     */
    @Transactional
    @GetMapping
    public ResponseEntity<List<SearchDiaryListRes>> getDiaries(@AuthenticationPrincipal Member member){
        List<SearchDiaryListRes> memberDiaries = diaryRepositoryCustom.findDiariesByMemberId(member.getMemberId());
        return ResponseEntity.ok(memberDiaries);
    }

    /**
     * 공유다이어리 생성
     * @param member
     * @return
     */
    @Transactional
    @PostMapping("/diary")
    public ResponseEntity<Void> createShareDiary(@AuthenticationPrincipal Member member, @RequestBody CreateShareDiaryReq createShareDiaryReq){
        mainService.createShareDiary(member, createShareDiaryReq);
        // 여기에 민지가 추가된 사람들(createShareDiaryReq.getMembers())에게 알림 보내기
        return ResponseEntity.ok().build();
    }
}