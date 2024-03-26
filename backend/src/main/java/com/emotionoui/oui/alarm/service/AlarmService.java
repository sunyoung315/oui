package com.emotionoui.oui.alarm.service;

import com.emotionoui.oui.alarm.dto.req.AlarmTestReq;
import com.emotionoui.oui.alarm.dto.res.SearchAlarmsRes;
import com.emotionoui.oui.diary.entity.Diary;
import com.emotionoui.oui.member.entity.Member;

import java.io.IOException;
import java.util.Date;
import java.util.List;


public interface AlarmService {
    public void sendMessageTo(AlarmTestReq alarmTestReq) throws IOException;

    public void createDeviceToken(Member member, String deviceToken);
    public void inviteDiary(List<String> emails, Integer diaryId, String createrNickname);
    public void sendFriendForcing(Integer diaryId, String pusherNickname, Integer memberId, Date date);
    public void sendFriendDiary(Diary diary, Integer dailyId, Member member);

//    public Boolean sendChatMessage(ChatRoom chatRoom, String userId);
//    public Boolean sendChatMessage(NotificationDto notificationDto);
//    public Boolean sendBiasMessage(List<String> ids, Long articleId);

    public List<SearchAlarmsRes> searchAlarmList(Integer memberId);
//
//    public String readMessage(Long notificationId);
//
//    public Boolean deleteMessage(Long notificationId);
}
